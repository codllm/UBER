import React, { useState, useEffect, useContext } from "react";
import {
  Phone,
  CheckCircle,
  QrCode,
  Banknote,
  ChevronLeft,
  Navigation,
  MapPin,
} from "lucide-react";
import { RidingContext } from "../context/ridingDataContext";
import { CaptionDataContext } from "../context/captionContext";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import socket from "../socket";
import axios from "axios";

const CaptainArriving = () => {
  const [otpPanelVisible, setOtpPanelVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const { rideData, setRideData } = useContext(RidingContext);
  const { caption } = useContext(CaptionDataContext);

  const [captainLocation, setCaptainLocation] = useState(null);
  const [mapTarget, setMapTarget] = useState(null);

  const [routePath, setRoutePath] = useState([]);
  const [pickupPathroute, setPickupPathRoute] = useState([]);
  const [distanceMeters, setDistanceMeters] = useState(null);

  const premiumDarkStyle = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [{ color: "#4b4b4b" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#383838" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#3c3c3c" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212121" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#000000" }],
    },
  ];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
  });

  useEffect(() => {
    const fetchRideDetails = async () => {
      if (rideData?._id) return;

      const rideId = localStorage.getItem("currentRide");
      const token = localStorage.getItem("token");

      if (!rideId || !token) return;

      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/rides/caption/details-by-id?rideId=${rideId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setRideData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRideDetails();
  }, []);

  useEffect(() => {
    if (rideData?._id) {
      socket.emit("join-ride", rideData._id);
    }
  }, [rideData]);

  useEffect(() => {
    let interval;

    if (rideData?._id && caption?.caption?._id) {
      interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const newLoc = { lat, lng };

          setCaptainLocation(newLoc);
          setMapTarget(newLoc);

          socket.emit("captain-location-update", {
            rideId: rideData._id,
            latitude: lat,
            longitude: lng,
          });
        });
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [rideData, caption]);

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

  useEffect(() => {
    if (!captainLocation || !pickupLocation) return;

    if (rideData?.status === "ongoing") return;

    const service = new window.google.maps.DirectionsService();

    service.route(
      {
        origin: captainLocation,
        destination: pickupLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          const route = result.routes[0];

          const path = route.overview_path.map((p) => ({
            lat: p.lat(),
            lng: p.lng(),
          }));

          setPickupPathRoute(path);

          const meters = route.legs[0].distance.value;
          setDistanceMeters(meters);
        }
      }
    );
  }, [captainLocation, pickupLocation, rideData?.status]);

  useEffect(() => {
    if (rideData?.status !== "ongoing") return;

    if (!pickupLocation || !destinationLocation) return;

    const service = new window.google.maps.DirectionsService();

    service.route(
      {
        origin: pickupLocation,
        destination: destinationLocation,
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
  }, [rideData?.status]);

  const verifyOtp = async () => {
    if (otp !== rideData.otp) return alert("Invalid OTP");

    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
      { rideId: rideData._id, otp },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    if (res.status === 200) {
      setRideData((prev) => ({ ...prev, status: "ongoing" }));

      socket.emit("otp-verified", { rideId: rideData._id });

      if (destinationLocation) setMapTarget(destinationLocation);
    }
  };

  if (!isLoaded)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );

  return (
    <div className="relative w-screen h-screen bg-[#0f172a] overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        zoom={16}
        center={mapTarget || pickupLocation || captainLocation}
        options={{ styles: premiumDarkStyle, disableDefaultUI: true }}
      >
        {(rideData?.status === "ongoing"
          ? destinationLocation
          : pickupLocation) && (
          <Marker
            position={
              rideData?.status === "ongoing"
                ? destinationLocation
                : pickupLocation
            }
          />
        )}

        {captainLocation && (
          <Marker
            position={captainLocation}
            icon={{
              url: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
              scaledSize: new window.google.maps.Size(35, 35),
              labelOrigin: new window.google.maps.Point(20, -10),
            }}
            label={{
              text:
                distanceMeters > 1000
                  ? `${(distanceMeters / 1000).toFixed(1)} km`
                  : `${distanceMeters} m`,
              fontSize: "12px",
              fontWeight: "bold",
              color: "#fff",
            }}
          />
        )}

        {rideData?.status !== "ongoing" && pickupPathroute.length > 0 && (
          <Polyline
            path={pickupPathroute}
            options={{ strokeColor: "#EDC001", strokeWeight: 6 }}
          />
        )}

        {rideData?.status === "ongoing" && routePath.length > 0 && (
          <Polyline
            path={routePath}
            options={{ strokeColor: "#EDC001", strokeWeight: 6 }}
          />
        )}
      </GoogleMap>

      {/* TOP BAR */}

      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-4 rounded-3xl flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Navigation size={18} className="text-blue-400" />
            </div>

            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">
                Distance
              </p>
              <p className="text-lg font-bold text-white">
                {distanceMeters
                  ? `${(distanceMeters / 1000).toFixed(1)} km`
                  : "--"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold">
              Status
            </p>
            <p className="text-amber-400 font-bold text-sm">
              {rideData?.status === "ongoing" ? "IN TRANSIT" : "APPROACHING"}
            </p>
          </div>
        </div>
      </div>

      {/* UI PANEL */}

      <div className="absolute bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-2xl border-t border-slate-700/50 px-6 pt-4 pb-10 rounded-t-[40px]">
        <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6 opacity-50" />

        {rideData?.status !== "ongoing" ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">
                  Incoming Pickup
                </p>
                <h3 className="text-xl font-bold text-white capitalize">
                  {rideData?.user?.fullname?.firstname}
                </h3>
              </div>

              <button className="p-4 bg-slate-800 rounded-2xl text-white">
                <a href={`tel:${rideData?.user?.contact}`}>
                  <Phone size={20} />
                </a>
              </button>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-2xl mb-8">
              <MapPin size={20} className="text-blue-400 mt-1" />
              <p className="text-sm text-slate-300">{rideData?.pickup}</p>
            </div>

            {!otpPanelVisible ? (
              <button
                className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl"
                onClick={() => setOtpPanelVisible(true)}
              >
                Confirm Arrival
              </button>
            ) : (
              <div className="space-y-6">
                <input
                  type="text"
                  maxLength="4"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="tracking-[0.5em] text-center text-3xl font-black border border-slate-700 bg-slate-950 text-white rounded-2xl py-5 w-full"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setOtpPanelVisible(false)}
                    className="px-6 py-5 bg-slate-800 text-slate-300 rounded-2xl"
                  >
                    Back
                  </button>

                  <button
                    onClick={verifyOtp}
                    className="flex-1 bg-green-600 text-white py-5 rounded-2xl"
                  >
                    Start Ride
                  </button>
                </div>
              </div>
            )}
          </>
        ) : !isFinishing ? (
          <>
            <h3 className="text-lg font-bold text-white mb-6">
              Heading To Destination
            </h3>

            <button
              className="w-full bg-white text-black font-black py-5 rounded-2xl"
              onClick={() => setIsFinishing(true)}
            >
              Complete Ride
            </button>
          </>
        ) : (
          <>
            <div
              className="flex items-center gap-2 mb-4 cursor-pointer"
              onClick={() => setIsFinishing(false)}
            >
              <ChevronLeft size={20} className="text-gray-400" />
              <span className="text-sm text-gray-400 font-medium">Back</span>
            </div>

            <h2 className="text-4xl font-black text-white mb-6 text-center">
              ₹{rideData?.fare}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`py-4 rounded-xl text-white border ${
                  paymentMethod === "cash"
                    ? "border-blue-500"
                    : "border-slate-700"
                }`}
              >
                Cash
              </button>

              <button
                onClick={() => setPaymentMethod("upi")}
                className={`py-4 rounded-xl text-white  border ${
                  paymentMethod === "upi"
                    ? "border-blue-500"
                    : "border-slate-700"
                }`}
              >
                UPI
              </button>
            </div>
            {paymentMethod === "upi" && (
              <div className="flex flex-col items-center bg-[#1c2943] p-4 rounded-2xl mb-6 border border-white/10">
                <img
                  src="https://res.cloudinary.com/dju008haw/image/upload/v1772892045/WhatsApp_Image_2026-03-07_at_19.29.27_vmbw2w.jpg"
                  alt="QR"
                  className="w-36 h-36 mb-2 rounded-lg"
                />

                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">
                  Scan To Pay
                </p>
              </div>
            )}

            <button className="w-full bg-green-600 text-white py-5 rounded-2xl">
              Finish Ride
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CaptainArriving;
