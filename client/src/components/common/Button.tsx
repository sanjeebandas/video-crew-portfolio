import React from 'react';

type Props = {
  label: string;
  onClick?: () => void;
};

const Button = ({ label, onClick }: Props) => {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-white text-black rounded">
      {label}
    </button>
  );
};

export default Button;
