import React, { useState, useEffect, useContext } from "react";
import { Phone, CheckCircle, QrCode, Banknote, ChevronLeft } from "lucide-react";
import { RidingContext } from "../context/ridingDataContext";
import { CaptionDataContext } from "../context/captionContext";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript
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

  const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#000000" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ece75f" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#82C8E5" }] },
    { featureType: "poi", stylers: [{ visibility: "on" }] },
  ];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
  });



  const calculateDistance = (loc1, loc2) => {

    const R = 6371;

    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(loc1.lat * Math.PI / 180) *
      Math.cos(loc2.lat * Math.PI / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round((R * c) * 1000);

  };

  // RESTORE RIDE 

  useEffect(() => {

    const fetchRideDetails = async () => {

      if (rideData?._id) return;

      const rideId = localStorage.getItem("currentRide");
      const token = localStorage.getItem("token");

      if (!rideId || !token) return;

      try {

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/caption/details-by-id?rideId=${rideId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setRideData(res.data);

      } catch (err) {
        console.log(err);
      }

    };

    fetchRideDetails();

  }, []);

  //captain join-room with the rideId
  useEffect(() => {

    if (rideData?._id) {
      socket.emit("join-ride", rideData._id);
    }

  }, [rideData]);

  // captain location call every after 3sec

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

  //LOCATIONS 

  const pickupLocation = rideData?.pickupLocation
    ? { lat: rideData.pickupLocation.latitude, lng: rideData.pickupLocation.longitude }
    : null;

  const destinationLocation = rideData?.destinationLocation
    ? { lat: rideData.destinationLocation.latitude, lng: rideData.destinationLocation.longitude }
    : null;

  // DISTANCE UPDATE

  useEffect(() => {

    if (!captainLocation) return;

    let target = null;

    if (rideData?.status === "ongoing") {
      target = destinationLocation;
    } else {
      target = pickupLocation;
    }

    if (!target) return;

    setDistanceMeters(calculateDistance(captainLocation, target));

  }, [captainLocation, pickupLocation, destinationLocation, rideData?.status]);

  /* ---------------- INITIAL MAP CENTER ---------------- */

  useEffect(() => {

    if (!mapTarget && pickupLocation) {
      setMapTarget(pickupLocation);
    }

  }, [pickupLocation]);

  /* ---------------- ROUTE BEFORE OTP (CAPTAIN → PICKUP) ---------------- */

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

          const path = result.routes[0].overview_path.map((p) => ({
            lat: p.lat(),
            lng: p.lng(),
          }));

          setPickupPathRoute(path);

        }

      }
    );

  }, [captainLocation, pickupLocation, rideData?.status]);

  /* ---------------- ROUTE AFTER OTP (PICKUP → DESTINATION) ---------------- */

  useEffect(() => {

    if (
      rideData?.status === "ongoing" &&
      pickupLocation &&
      destinationLocation &&
      routePath.length === 0
    ) {

      const service = new window.google.maps.DirectionsService();

      service.route(
        {
          origin: pickupLocation,
          destination: destinationLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {

          if (status === "OK") {

            const path = result.routes[0].overview_path.map((p) => ({
              lat: p.lat(),
              lng: p.lng(),
            }));

            setRoutePath(path);

          }

        }
      );

    }

  }, [rideData?.status]);

  if (!isLoaded)
    return <div className="h-screen flex items-center justify-center">Loading Map...</div>;

  // VERIFY OTP

  const verifyOtp = async () => {

    if (otp === rideData.otp) {

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        { rideId: rideData._id, otp },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.status === 200) {

        setRideData((prev) => ({ ...prev, status: "ongoing" }));

        if (destinationLocation) {
          setMapTarget(destinationLocation);
        }

        socket.emit("otp-verified", { rideId: rideData._id });

      }

    } else {

      alert("Invalid OTP");

    }

  };

  return (
    <div className="relative w-screen h-screen bg-gray-100 font-sans overflow-hidden">

      {/* MAP */}

      <div className="absolute inset-0 pb-60">

        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          zoom={17}
          center={mapTarget || pickupLocation || captainLocation}
          options={{ styles: darkMapStyle, disableDefaultUI: true }}
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
                scaledSize: new window.google.maps.Size(40, 40),
                labelOrigin: new window.google.maps.Point(20, -10)
              }}
              label={
                distanceMeters
                  ? {
                      text: `${distanceMeters} m`,
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#000"
                    }
                  : undefined
              }
            />
          )}

          {rideData?.status !== "ongoing" && pickupPathroute.length > 0 && (
            <Polyline
              path={pickupPathroute}
              options={{
                strokeColor: "#000000",
                strokeWeight: 5
              }}
            />
          )}

          {rideData?.status === "ongoing" && routePath.length > 0 && (
            <Polyline
              path={routePath}
              options={{
                strokeColor: "#000000",
                strokeWeight: 2
              }}
            />
          )}

        </GoogleMap>

      </div>

      {/* UI PANEL */}

<div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 px-6 pt-4 pb-10 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-all duration-500">
  
  <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

  {/* STEP 1: OTP FLOW */}
  {rideData?.status !== "ongoing" ? (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
            Incoming Pickup
          </p>
          <h3 className="text-xl font-bold text-gray-900 capitalize">
            {rideData?.user?.fullname?.firstname}
          </h3>
        </div>

        <button className="p-3 bg-gray-50 border border-gray-100 rounded-full text-gray-700 active:bg-gray-200">
          <Phone size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-8">
        <div className="w-3 h-3 rounded-full border-[3px] border-black bg-white" />
        <p className="text-sm text-gray-600 font-medium truncate">
          {rideData?.pickup}
        </p>
      </div>

      {!otpPanelVisible ? (
        <button
          className="w-full bg-black text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform text-lg"
          onClick={() => setOtpPanelVisible(true)}
        >
          I have arrived
        </button>
      ) : (
        <div className="space-y-6">

          <div className="flex flex-col items-center">
            <p className="text-sm font-semibold text-gray-500 mb-4">
              Enter Rider's OTP
            </p>

            <input
              type="text"
              maxLength="4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="tracking-[1em] text-center text-2xl font-black border-2 border-gray-100 bg-gray-50 rounded-2xl py-4 w-full focus:border-green-500 outline-none"
              placeholder="0000"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setOtpPanelVisible(false)}
              className="px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl"
            >
              Back
            </button>

            <button
              onClick={verifyOtp}
              className="flex-1 bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg active:bg-green-700"
            >
              Confirm & Start
            </button>
          </div>

        </div>
      )}
    </>
  ) : !isFinishing ? (

    /* STEP 2: ONGOING TRIP */

    <div className="animate-in fade-in slide-in-from-bottom-6">

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">

          <div className="bg-green-100 p-2 rounded-full">
            <CheckCircle size={20} className="text-green-600" />
          </div>

          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Trip Ongoing
            </p>

            <h3 className="text-xl font-bold text-gray-900 truncate max-w-[200px]">
              To: {rideData?.destination}
            </h3>
          </div>

        </div>
      </div>

      <button
        className="w-full bg-black text-white font-bold py-5 rounded-2xl shadow-xl active:scale-95 transition-all text-lg"
        onClick={() => setIsFinishing(true)}
      >
        Complete Ride
      </button>

    </div>

  ) : (

    /* STEP 3: PAYMENT */

    <div className="animate-in fade-in slide-in-from-bottom-6">

      <div
        className="flex items-center gap-2 mb-4 cursor-pointer"
        onClick={() => setIsFinishing(false)}
      >
        <ChevronLeft size={20} className="text-gray-400" />
        <span className="text-sm text-gray-400 font-medium">Back</span>
      </div>

      <div className="text-center mb-6">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">
          Ride Fare
        </p>
        <h2 className="text-4xl font-black text-gray-900">
          ₹{rideData?.fare}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">

        <button
          onClick={() => setPaymentMethod("cash")}
          className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${
            paymentMethod === "cash"
              ? "border-green-600 bg-green-50 text-green-700"
              : "border-gray-100 bg-gray-50 text-gray-400"
          }`}
        >
          <Banknote size={18} />
          <span className="font-bold">Cash</span>
        </button>

        <button
          onClick={() => setPaymentMethod("upi")}
          className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${
            paymentMethod === "upi"
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-100 bg-gray-50 text-gray-400"
          }`}
        >
          <QrCode size={18} />
          <span className="font-bold">UPI / QR</span>
        </button>

      </div>

      {paymentMethod === "upi" && (

        <div className="flex flex-col items-center bg-white p-4 rounded-2xl mb-6 border-2 border-dashed border-gray-200">

          <img
            src="https://res.cloudinary.com/dju008haw/image/upload/v1772892045/WhatsApp_Image_2026-03-07_at_19.29.27_vmbw2w.jpg"
            alt="QR"
            className="w-32 h-32 mb-2"
          />

          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
            Scan to Pay Captain
          </p>

        </div>
      )}

      <button className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl shadow-xl active:scale-95 transition-all text-lg">
        Finish & Clear Ride
      </button>

    </div>
  )}

</div>

    </div>
  );
};

export default CaptainArriving;