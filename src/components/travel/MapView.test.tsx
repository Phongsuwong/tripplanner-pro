// Simple test file to check if imports are working correctly
import Map from 'react-map-gl/dist/esm/components/map';
import Marker from 'react-map-gl/dist/esm/components/marker';
import Popup from 'react-map-gl/dist/esm/components/popup';
import NavigationControl from 'react-map-gl/dist/esm/components/navigation-control';
import Source from 'react-map-gl/dist/esm/components/source';
import Layer from 'react-map-gl/dist/esm/components/layer';
import { MapRef } from 'react-map-gl';

// If this file compiles without errors, the imports are working correctly
const TestImports = () => {
  return <div>Test imports</div>;
};

export default TestImports;