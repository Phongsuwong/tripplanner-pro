// Add mapboxgl types that might be needed
declare namespace mapboxgl {
  class LngLatBounds {
    extend(lngLat: [number, number] | mapboxgl.LngLat): this;
    isEmpty(): boolean;
    getNorth(): number;
    getSouth(): number;
    getWest(): number;
    getEast(): number;
  }
  
  class LngLat {
    lng: number;
    lat: number;
    constructor(lng: number, lat: number);
  }
}