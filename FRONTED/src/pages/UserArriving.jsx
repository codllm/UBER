import React, { useEffect, useState, useContext } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import { RidingContext } from "../context/ridingDataContext";
import { Phone, Navigation } from "lucide-react";
import socket from "../socket";
import axios from "axios";

const UserArriving = () => {

  const premiumDarkStyle = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#4b4b4b" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#383838" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  ];

  const { rideData, setRideData } = useContext(RidingContext);

  const [captainLocation, setCaptainLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [distanceMeters, setDistanceMeters] = useState(null);
  const [loadingRide, setLoadingRide] = useState(true);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
  });

  const containerStyle = { width: "100%", height: "100%" };

  /* FETCH RIDE */

  useEffect(() => {

    const fetchRideDetails = async () => {

      const rideId = localStorage.getItem("currentRide");

      if (!rideId) {
        setLoadingRide(false);
        return;
      }

      try {

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/details-by-id?rideId=${rideId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );

        setRideData({
          ...res.data,
          caption: res.data.caption || res.data.captain
        });

      } catch (err) {
        console.log(err);
      }

      setLoadingRide(false);

    };

    fetchRideDetails();

  }, []);

  /* JOIN ROOM */

  useEffect(() => {

    if (!rideData?._id) return;

    socket.emit("join-ride", rideData._id);

  }, [rideData]);

  /* CAPTAIN LOCATION */

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
    ? { lat: rideData.pickupLocation.latitude, lng: rideData.pickupLocation.longitude }
    : null;

  const destinationLocation = rideData?.destinationLocation
    ? { lat: rideData.destinationLocation.latitude, lng: rideData.destinationLocation.longitude }
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

    const service = new window.google.maps.DirectionsService();

    service.route(
      {
        origin: captainLocation,
        destination: target,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {

        if (status === "OK") {

          const route = result.routes[0];

          const path = route.overview_path.map((p) => ({
            lat: p.lat(),
            lng: p.lng(),
          }));

          setRoutePath(path);

          const meters = route.legs[0].distance.value;
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

  /* OTP VERIFIED */

  useEffect(() => {

    const handleOtpVerified = (rideId) => {

      if (rideData?._id !== rideId) return;

      setRideData(prev => ({
        ...prev,
        status: "ongoing"
      }));

      if (captainLocation) setMapCenter(captainLocation);

    };

    socket.on("otp-verified-success", handleOtpVerified);

    return () => socket.off("otp-verified-success", handleOtpVerified);

  }, [rideData, captainLocation]);

  if (loadingRide) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading Ride...</div>;
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">

      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={17}
        center={mapCenter}
        options={{ styles: premiumDarkStyle, disableDefaultUI: true }}
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
            label={distanceMeters ? {
              text: `${distanceMeters} m`,
              fontSize: "12px",
              fontWeight: "bold",
              color: "#fff",
            } : undefined}
          />
        )}

        {routePath.length > 0 && (
          <Polyline
            path={routePath}
            options={{
             strokeColor: "#EDC001",
                strokeOpacity: 0.8,
                strokeWeight: 6,
                geodesic: true,
            }}
          />
        )}

      </GoogleMap>

      {/* TOP DASHBOARD */}

      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%]">
        <div className="bg-[#121b2d]/90 backdrop-blur-md p-4 rounded-2xl flex justify-between items-center shadow-xl border border-white/5">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600/30 rounded-lg flex items-center justify-center">
              <Navigation size={16} className="text-blue-400 rotate-45"/>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold">Distance</p>
              <p className="text-white font-bold text-sm">
                {distanceMeters ? `${(distanceMeters/1000).toFixed(1)} km` : "--"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Status</p>
            <p className="text-green-400 font-bold text-xs uppercase">
              In Transit
            </p>
          </div>

        </div>
      </div>

      {/* BOTTOM CARD */}

      {/* BOTTOM CARD */}

<div className="absolute bottom-0 w-full">

<div className="bg-[#121b2d] rounded-[32px] p-6 shadow-2xl border-t border-white/5">

  <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-6 opacity-30"/>

  {/* Captain Info */}

  <div className="flex items-center justify-between mb-6">

    <div className="flex items-center gap-4">

      <img
        src="https://randomuser.me/api/portraits/men/32.jpg"
        alt="captain"
        className="w-12 h-12 rounded-full object-cover border border-white/10"
      />

      <div>

        <p className="text-white font-bold capitalize text-lg">
          {rideData?.caption?.fullname?.firstname}
        </p>

        <p className="text-xs text-blue-400 font-semibold">
          {rideData?.caption?.vehicle?.plate}
        </p>

      </div>

    </div>

    <button className="p-3 bg-[#1c2943] rounded-full border border-white/5">
      <a href={`tel:${rideData?.caption?.contact}`}><Phone size={18} className="text-white"/></a>
    </button>

  </div>

  {/* OTP SECTION */}

  <div className="flex items-center justify-between mb-6">

  <div className="text-left">
      <p className="text-[10px] text-gray-400 uppercase font-bold">
        Status
      </p>

      <p className="text-green-400 font-bold text-sm uppercase">
        {rideData?.status === "ongoing"
          ? "Ride Started"
          : "Captain Arriving"}
      </p>
    </div>
    <div>
      <p className="text-[12px] text-white ml-1 uppercase tracking-widest font-bold">
        OTP
      </p>

      <h4 className="text-xl font-mono font-bold bg-yellow-400 text-black px-4 py-1 rounded-lg">
        {rideData?.otp}
      </h4>
    </div>

    

  </div>

  {/* Destination */}

  <div className="flex items-center gap-3 mb-6">

    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
      <Navigation size={18} className="text-green-400"/>
    </div>

    <div className="flex-1 overflow-hidden">

      <p className="text-[10px] text-gray-400 uppercase font-bold">
        Destination
      </p>

      <h3 className="text-white font-bold text-lg truncate">
        {rideData?.destination}
      </h3>

    </div>

  </div>

  {/* CTA */}

  <button className="w-full bg-white text-black font-black py-5 rounded-2xl text-lg uppercase tracking-tight active:scale-95 transition-transform">

    {rideData?.status === "ongoing"
      ? "Ride In Progress"
      : "Meeting Captain"}

  </button>

</div>

</div>

    </div>
  );
};

export default UserArriving;