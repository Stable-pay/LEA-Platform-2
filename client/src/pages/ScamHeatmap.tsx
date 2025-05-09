import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Share2 } from "lucide-react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN';

const fraudData = [
  {
    type: "Feature", 
    geometry: {
      type: "Point",
      coordinates: [72.5714, 23.0225], // Ahmedabad
    },
    properties: {
      scamType: "USDT",
      value: 3250000,
      location: "Ahmedabad", 
      status: "FIR Filed",
      date: "2025-04-10"
    }
  },
  {
    type: "Feature",
    geometry: {
      type: "Point", 
      coordinates: [77.1025, 28.7041], // Delhi
    },
    properties: {
      scamType: "P2P",
      value: 5500000,
      location: "Delhi",
      status: "Arrest Made", 
      date: "2025-03-22"
    }
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [88.3639, 22.5726], // Kolkata
    },
    properties: {
      scamType: "Bitcoin",
      value: 4200000,
      location: "Kolkata",
      status: "Under Investigation",
      date: "2025-04-01"
    }
  }
];

export default function ScamHeatmap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng] = useState(78.9629);
  const [lat] = useState(22.5937);
  const [zoom] = useState(4.5);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      map.current?.addSource("fraud", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: fraudData,
        },
      });

      map.current?.addLayer({
        id: "fraud-heat",
        type: "heatmap",
        source: "fraud",
        maxzoom: 9,
        paint: {
          "heatmap-weight": ["interpolate", ["linear"], ["get", "value"], 0, 0, 5000000, 1],
          "heatmap-intensity": 1,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(33,102,172,0)",
            0.2, "rgb(103,169,207)",
            0.4, "rgb(209,229,240)",
            0.6, "rgb(253,219,199)",
            0.8, "rgb(239,138,98)",
            1, "rgb(178,24,43)",
          ],
          "heatmap-radius": 20,
          "heatmap-opacity": 0.75,
        },
      });

      map.current?.on("click", "fraud-heat", (e) => {
        const features = e.features;
        if (!features?.length) return;

        const props = features[0].properties;
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <strong>${props.scamType} Scam</strong><br/>
            Location: ${props.location}<br/>
            Amount: ₹${props.value.toLocaleString()}<br/>
            Status: ${props.status}<br/>
            Date: ${props.date}
          `)
          .addTo(map.current!);
      });

      map.current?.on("mouseenter", "fraud-heat", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });

      map.current?.on("mouseleave", "fraud-heat", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
    });
  }, [lng, lat, zoom]);

  return (
    <div className="p-4 space-y-4 min-h-screen bg-background">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Crypto Fraud Heatmap</CardTitle>
          <div className="flex items-center space-x-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="usdt">USDT</SelectItem>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="p2p">P2P</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div ref={mapContainer} className="h-[600px] w-full" />
          </div>
          <div className="mt-4 flex justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Total Cases: {fraudData.length}</Badge>
              <Badge variant="outline">
                Total Value: ₹{fraudData.reduce((acc, curr) => acc + curr.properties.value, 0).toLocaleString()}
              </Badge>
            </div>
            <div className="text-muted-foreground">
              Updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}