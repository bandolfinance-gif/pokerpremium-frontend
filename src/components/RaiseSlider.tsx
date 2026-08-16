import React from 'react';

interface RaiseSliderProps {
  valor: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

const RaiseSlider: React.FC<RaiseSliderProps> = ({ valor, min, max, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className='raise-slider'>
      <div className='raise-slider-labels'>
        <span>MIN</span>
        <span>ALL IN</span>
      </div>
      <input
        type='range'
        min={min}
        max={max}
        value={valor}
        onChange={handleChange}
      />
      <div className='raise-slider-valor'>
        {valor}
      </div>
      <div className='raise-slider-presets'>
        <button onClick={() => onChange(min * 2)}>x2</button>
        <button onClick={() => onChange(min * 3)}>x3</button>
      </div>
    </div>
  );
};

export default RaiseSlider;


