'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ComposableMap,
  Geographies,
  Geography,
  GeographyProps,
} from 'react-simple-maps';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

const geoUrl =
  'https://raw.githubusercontent.com/subyfly/topojson/master/world-countries.json';

interface CustomGeographyProps extends GeographyProps {
  properties: {
    name: string;
  };
}

export const InteractiveMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const router = useRouter();
  const { theme } = useTheme();

  // Responsive projection configuration
  const getProjectionConfig = useCallback(() => {
    // Default scale for mobile
    let scale = 120;
    let centerLat = 30;

    // Adjust scale based on viewport width
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        // lg
        scale = 150;
        centerLat = 0;
      } else if (window.innerWidth >= 768) {
        // md
        scale = 130;
        centerLat = 20;
      }
    }

    return {
      scale,
      center: [0, centerLat] as [number, number],
    };
  }, []);

  return (
    <div className="relative w-full aspect-[3/2] md:aspect-[2/1] lg:aspect-[3/1] max-h-[500px] md:max-h-[400px] lg:max-h-[450px] bg-white dark:bg-black">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={getProjectionConfig()}
        className="w-full h-full"
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
                    fill:
                      theme === 'dark' ? 'rgb(38 38 38)' : 'rgb(243 244 246)',
                    stroke:
                      theme === 'dark' ? 'rgb(23 23 23)' : 'rgb(229 231 235)',
                    strokeWidth: 0.75,
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 250ms',
                  },
                  hover: {
                    cursor: 'pointer',
                    fill:
                      theme === 'dark' ? 'rgb(59 130 246)' : 'rgb(37 99 235)',
                    stroke:
                      theme === 'dark' ? 'rgb(23 23 23)' : 'rgb(229 231 235)',
                    strokeWidth: 0.75,
                    outline: 'none',
                    zIndex: 1,
                  },
                  pressed: {
                    fill:
                      theme === 'dark' ? 'rgb(29 78 216)' : 'rgb(30 64 175)',
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
          className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg shadow-lg z-20 text-sm font-medium"
        >
          {hoveredCountry}
        </motion.div>
      )}
    </div>
  );
};
