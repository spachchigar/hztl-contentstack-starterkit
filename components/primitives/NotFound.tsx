import React from 'react';

type NotFoundProps = {
  componentUid?: string;
  componentName?: string;
};

export const NotFound = ({ componentUid, componentName }: NotFoundProps) => {
  console.warn(
    `Implementation of component "${componentName}"${
      componentUid ? ` - "${componentUid}"` : ''
    } not found`
  );
  return (
    <div className="w-[400px] p-2 bg-orange-400 border-5 border-orange-300">
      <h2 className="text-white">{componentName}</h2>
      <p>Component implementation is missing. See the developer console for more information.</p>
    </div>
  );
};
