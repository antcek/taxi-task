import React, { useEffect } from "react";
import { Crew } from "../types";
import { getCrews } from "../services/taxiService";

interface MapProps {
  onAddressSelect: (address: string) => void;
  onCrewSelect: (crews: Crew[]) => void;
}

const Map: React.FC<MapProps> = ({ onAddressSelect, onCrewSelect }) => {
  useEffect(() => {
    const yandexMapScript = document.createElement("script");
    yandexMapScript.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    yandexMapScript.onload = () => {
      // @ts-ignore
      const ymaps = window.ymaps;
      ymaps.ready(init);

      function init() {
        const map = new ymaps.Map("map", {
          center: [56.839439, 53.218803],
          zoom: 12,
        });

        map.events.add("click", async function (e: any) {
          const coords = e.get("coords");
          const address = prompt("Введите адрес для этих координат");
          if (address) {
            onAddressSelect(address);
            const crews = await getCrews(address, new Date().toISOString());
            onCrewSelect(crews);
            const placemark = new ymaps.Placemark(
              coords,
              {
                balloonContent: address,
              },
              {
                preset: "islands#yellowDotIcon",
              }
            );
            map.geoObjects.add(placemark);
            crews.forEach((crew) => {
              const crewPlacemark = new ymaps.Placemark(
                [crew.lat, crew.lon],
                {
                  balloonContent: `${crew.car_mark} ${crew.car_model}, ${crew.car_color}, ${crew.car_number}`,
                },
                {
                  preset: "islands#greenDotIcon",
                }
              );
              map.geoObjects.add(crewPlacemark);
            });
          } else {
            const placemark = new ymaps.Placemark(
              coords,
              {
                balloonContent: "Адрес не найден",
              },
              {
                preset: "islands#redDotIcon",
              }
            );
            map.geoObjects.add(placemark);
          }
        });
      }
    };
    document.body.appendChild(yandexMapScript);
  }, [onAddressSelect, onCrewSelect]);

  return <div id="map" style={{ width: "100%", height: "400px" }} />;
};

export default Map;
