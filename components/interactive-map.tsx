"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ComposableMap,
  Geographies,
  Geography,
  GeographyProps,
} from "react-simple-maps";
import { motion } from "framer-motion";

const geoUrl =
  "https://raw.githubusercontent.com/subyfly/topojson/master/world-countries.json";

interface CustomGeographyProps extends GeographyProps {
  properties: {
    name: string;
  };
}

export const InteractiveMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="relative w-full h-[400px] md:h-[600px] z-0">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 90,
          center: [0, 0],
        }}
        width={800}
        height={400}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: CustomGeographyProps[] }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.properties.name}
                geography={geo}
                onMouseEnter={() => setHoveredCountry(geo.properties.name)}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={() => router.push(`/country/${geo.id}`)}
                style={{
                  default: {
                    fill: "#2A2A2A",
                    stroke: "#1E1E1E",
                    strokeWidth: 0.5,
                    outline: "none",
                    cursor: "pointer",
                  },
                  hover: {
                    cursor: "pointer",
                    fill: "#00FFFF",
                    stroke: "#1E1E1E",
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
      {hoveredCountry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded z-20"
        >
          {hoveredCountry}
        </motion.div>
      )}
    </div>
  );
};
