import React from 'react';
import '../../styles/FuturisticTable.css';

const FuturisticTable: React.FC = () => {
  return (
    <div className='futuristic-table-wrapper'>
      <div className='table-glow-ring'></div>
      <div className='table-surface'>
        <div className='table-center-core'></div>
        <div className='table-slot table-slot-1'></div>
        <div className='table-slot table-slot-2'></div>
        <div className='table-slot table-slot-3'></div>
        <div className='table-slot table-slot-4'></div>
        <div className='table-slot table-slot-5'></div>
        <div className='table-slot table-slot-6'></div>
      </div>
    </div>
  );
};

export default FuturisticTable;
