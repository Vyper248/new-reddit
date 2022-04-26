import React from 'react';
import { QrReader } from 'react-qr-reader';

const QRReader = ({setQRCode}) => {
  return (
    <div>
      <QrReader
        constraints={{facingMode: 'environment'}}
        onResult={(result, error) => {
          if (result) {
            setQRCode(result?.text);
          }

          if (error) {
            // console.info(error);
          }
        }}
      />
    </div>
  );
};

export default QRReader;