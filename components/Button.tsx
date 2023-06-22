import { ButtonHTMLAttributes } from "react";
//Component Button

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';

}
// Props do componente de botão
export default function Button({ variant = 'primary', ...props }: ButtonProps) {
  const buttonClasses = `whitespace-nowrap transition-all min-w-[10rem] p-4 py-2 rounded-md  text-lg  font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  ${variant === 'primary' ? ' bg-green-800 hover:bg-green-900 text-gray-50 shadow-sm focus-visible:outline-green-800' : variant === 'secondary' ? '  bg-purple-800 hover:bg-purple-900 text-gray-50 shadow-sm focus-visible:outline-purple-800' : 'bg-red-700 hover:bg-red-800 text-gray-50 shadow-sm focus-visible:outline-red-800 '
    }`;

  return (
    <button
      className={`${buttonClasses} `}
      {...props}
    />
  )
}
