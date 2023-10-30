import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function Agung() {
  const { parameters } = useParams();
  const [redirectData, setRedirectData] = useState([]); // Menggunakan array untuk menampung
  const [loading, setLoading] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    axios
      .get("https://api.github.com/repos/AgungDevlop/React/contents/url.json")
      .then((resp) => {
        const downloadURL = resp.data.download_url;
        axios
          .get(downloadURL)
          .then((downloadResp) => {
            setRedirectData(downloadResp.data);
            console.log("s", redirectData);
            console.log("saa", downloadResp.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    function addLoading() {
      setLoading((prevLoadings) =>
        prevLoadings.length >= 3 ? "" : prevLoadings + "."
      );
    }
    const interval = setInterval(addLoading, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const matchedLink = redirectData.find((item) =>
      Object.keys(item).includes(parameters)
    );

    if (matchedLink) {
      const key = Object.keys(matchedLink)[0];
      const link = matchedLink[key];

      // Animasi loading dari 0% ke 20% ke 100%
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress((prevProgress) => {
          if (prevProgress < 20) return prevProgress + 1;
          if (prevProgress === 20) return 100;
          return prevProgress;
        });
      }, 50); // Interval setiap 50ms

      // Redirect setelah selesai animasi
      setTimeout(() => {
        clearInterval(interval);
        window.location.href = link;
      }, 2500); // Atur sesuai kebutuhan
    }
  }, [parameters, redirectData]);

  const loadingBarStyle = {
    width: `${loadingProgress}%`,
  };

  return (
    <div>
      {parameters in redirectData ? (
        <div className="py-[25%] text-center text-3xl text-white h-screen bg-gray-500">
          <p>
            <span className="text-4xl">404</span> Not Found
          </p>
        </div>
      ) : (
        <div>
          {redirectData.find((item) => Object.keys(item).includes(parameters)) ? 
          (
            <div className="loading-bar">
              <div className="progress" style={loadingBarStyle}></div>
              <div className="py-[25%] text-center text-3xl text-white h-screen bg-gray-500">
                <p>
                  <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" />
                  Loading {loading}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-[25%] text-center text-3xl text-white h-screen bg-gray-500">
              <p>
                <span className="text-4xl">404</span> Not Found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
