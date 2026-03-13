import React, { useEffect, useState, useContext } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import { RidingContext } from "../context/ridingDataContext";
import { Phone } from "lucide-react";
import socket from "../socket";
import axios from "axios";

const UserArriving = () => {

  const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#000000" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ece75f" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#82C8E5" }] },
    { featureType: "poi", stylers: [{ visibility: "on" }] },
  ];

  const { rideData, setRideData } = useContext(RidingContext);

  const [captainLocation, setCaptainLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [loadingRide, setLoadingRide] = useState(true);
  const [distanceMeters, setDistanceMeters] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
  });

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  /* FETCH RIDE */

  useEffect(() => {

    const fetchRideDetails = async () => {

      const currentRideId = localStorage.getItem("currentRide");

      if (!currentRideId) {
        setLoadingRide(false);
        return;
      }

      try {

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/details-by-id?rideId=${currentRideId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );

        const rideDetails = {
          ...res.data,
          caption: res.data.caption || res.data.captain
        };

        setRideData(rideDetails);

      } catch (err) {

        console.log(err);

      } finally {

        setLoadingRide(false);

      }

    };

    fetchRideDetails();

  }, []);

  /* JOIN RIDE ROOM */

  useEffect(() => {

    if (!rideData?._id) return;

    socket.emit("join-ride", rideData._id);

  }, [rideData]);

  /* CAPTAIN LOCATION SOCKET */

  useEffect(() => {

    const handleLocation = (data) => {

      const location = {
        lat: data.latitude,
        lng: data.longitude,
      };

      setCaptainLocation(location);

    };

    socket.on("captain-location", handleLocation);

    return () => socket.off("captain-location", handleLocation);

  }, []);

  const pickupLocation = rideData?.pickupLocation
    ? {
        lat: rideData.pickupLocation.latitude,
        lng: rideData.pickupLocation.longitude,
      }
    : null;

  const destinationLocation = rideData?.destinationLocation
    ? {
        lat: rideData.destinationLocation.latitude,
        lng: rideData.destinationLocation.longitude,
      }
    : null;

  /* MAP CENTER */

  useEffect(() => {

    if (!mapCenter && (captainLocation || pickupLocation)) {
      setMapCenter(captainLocation || pickupLocation);
    }

  }, [captainLocation, pickupLocation]);

  /* ROUTE + DISTANCE */

  useEffect(() => {

    if (!isLoaded) return;
    if (!captainLocation) return;
    if (!pickupLocation) return;

    let target = pickupLocation;

    if (rideData?.status === "ongoing") {

      if (!destinationLocation) return;

      target = destinationLocation;

    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: captainLocation,
        destination: target,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {

        if (status === "OK") {

          const path = result.routes[0].overview_path.map((p) => ({
            lat: p.lat(),
            lng: p.lng(),
          }));

          setRoutePath(path);

          /* ⭐ REAL ROAD DISTANCE FIX */
          const meters = result.routes[0].legs[0].distance.value;
          setDistanceMeters(meters);

        }

      }
    );

  }, [
    captainLocation,
    pickupLocation,
    destinationLocation,
    rideData?.status,
    isLoaded
  ]);

  /* OTP VERIFIED EVENT */

  useEffect(() => {

    const handleOtpVerified = (rideId) => {

      if (rideData?._id !== rideId) return;

      setRideData(prev => ({
        ...prev,
        status: "ongoing"
      }));

      if (captainLocation) {
        setMapCenter(captainLocation);
      }

    };

    socket.on("otp-verified-success", handleOtpVerified);

    return () => {
      socket.off("otp-verified-success", handleOtpVerified);
    };

  }, [rideData, captainLocation]);

  if (loadingRide) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Loading ride details...
      </div>
    );
  }

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="relative w-screen h-screen">

      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={17}
        center={mapCenter}
        options={{
          styles: darkMapStyle,
          disableDefaultUI: true,
        }}
      >

        {pickupLocation && <Marker position={pickupLocation} />}

        {captainLocation && (
          <Marker
            position={captainLocation}
            icon={{
              url: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
              scaledSize: new window.google.maps.Size(40, 40),
              labelOrigin: new window.google.maps.Point(20, -10)
            }}
            label={
              distanceMeters
                ? {
                    text: `${distanceMeters} m`,
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#000",
                  }
                : undefined
            }
          />
        )}

        {routePath.length > 0 && (
          <Polyline
            path={routePath}
            options={{
              strokeColor: "#000000",
              strokeWeight: 3,
            }}
          />
        )}

      </GoogleMap>

      {/* UI PANEL */}

      <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] px-4 sm:px-6 md:px-8 pt-2 pb-6 sm:pb-8">

        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:mb-6" />

        <div className="flex items-center justify-between mb-4 sm:mb-6">

          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            Captain is arriving
          </h3>

          <div className="flex flex-col items-end">

            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
              OTP
            </span>

            <h4 className="text-lg sm:text-xl font-mono font-bold bg-yellow-400 px-3 py-1 rounded-lg shadow-sm border border-yellow-500">
              {rideData?.otp}
            </h4>

          </div>

        </div>

        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-2xl mb-4 sm:mb-6 border border-gray-100">

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="relative">

              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="captain"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shadow-sm"
              />

              <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>

            </div>

            <div>

              <p className="font-bold text-gray-900 text-base sm:text-lg capitalize">
                {rideData?.caption?.fullname?.firstname}
              </p>

              <p className="text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">
                {rideData?.caption?.vehicle?.plate}
              </p>

            </div>

          </div>

          <button className="p-2 sm:p-3 bg-white rounded-full shadow-md border border-gray-100">
            <Phone size={20} className="text-gray-700" />
          </button>

        </div>

      </div>

    </div>
  );
};

export default UserArriving;