import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function Agung() {
  const { parameters } = useParams();
  const [redirectData, setRedirectData] = useState([]);
  const [loading, setLoading] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true); // Tambahkan state untuk menandai proses pengunduhan data

  useEffect(() => {
    axios
      .get("https://api.github.com/repos/AgungDevlop/React/contents/url.json")
      .then((resp) => {
        const downloadURL = resp.data.download_url;
        axios
          .get(downloadURL)
          .then((downloadResp) => {
            setRedirectData(downloadResp.data);
            setIsLoadingData(false); // Setelah selesai unduh data, nonaktifkan status loading
          })
          .catch(function (error) {
            console.log(error);
            setIsLoadingData(false); // Nonaktifkan status loading jika terjadi kesalahan
          });
      })
      .catch(function (error) {
        console.log(error);
        setIsLoadingData(false); // Nonaktifkan status loading jika terjadi kesalahan
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

      // Animasi loading dari 0% ke 100%
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress((prevProgress) => {
          if (prevProgress < 100) return prevProgress + 1;
          return prevProgress;
        });
      }, 14.5); // Interval setiap 25ms

      // Redirect setelah selesai animasi
      setTimeout(() => {
        clearInterval(interval);
        window.location.href = link;
      }, 2500);
    }
  }, [parameters, redirectData]);

  const loadingBarStyle = {
    width: `${loadingProgress}%`,
  };

  return (
    <div>
      {isLoadingData ? (
        <div className="py-[25%] text-center text-3xl text-white h-screen bg-gray-500">
          <p>
            <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" />
            Loading {loading}
          </p>
        </div>
      ) : parameters in redirectData ? (
        <div className="py-[25%] text-center text-3xl text-white h-screen bg-gray-500">
          <p>
            <span className="text-4xl">404</span> Not Found 44
          </p>
        </div>
      ) : (
        <div>
          {redirectData.find((item) =>
            Object.keys(item).includes(parameters)
          ) ? (
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
            <div>
              {parameters in redirectData ? (
                <div className="loading-bar">
                  <div className="progress" style={loadingBarStyle}></div>
                  <div className="py-[25%] text-center text-3xl text-white h-screen bg-gray-500">
                    <p>
                      <FontAwesomeIcon
                        icon={faCircleNotch}
                        spin
                        className="me-2"
                      />
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
      )}
    </div>
  );
}
