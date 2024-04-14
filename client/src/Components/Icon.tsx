type IconProps = {
  icon: string
  className: string
  fillClass: string
}

function Icon({ icon, className, fillClass }: IconProps) {
  switch (icon) {
    case 'shield':
      return (
        <svg className={className} viewBox="0 0 20 20">
          <path
            className={fillClass}
            fillRule="evenodd"
            d="M1.49335 2.87876C3.75731 2.56215 6.75711 1.61569 9.12801 0.232947C9.65955 -0.0770602 10.322 -0.0768069 10.8561 0.228675C13.2245 1.58316 16.3581 2.51974 18.5061 2.85685C19.3242 2.98523 19.997 3.66653 19.9975 4.49494L19.9977 4.99602C20.0282 11.0387 19.5177 16.3279 10.5253 19.8994C10.1875 20.0336 9.80128 20.0335 9.46347 19.8993C0.478494 16.3278 -0.0292758 11.0386 0.00115097 4.99602L1.6541e-05 4.49924C-0.00187902 3.66915 0.67158 2.99369 1.49335 2.87876ZM10.7071 9.29289C10.5196 9.10535 10.2652 9 10 9C9.73478 9 9.48043 9.10535 9.29289 9.29289C9.10535 9.48043 9 9.73478 9 10C9 10.2652 9.10535 10.5196 9.29289 10.7071C9.48043 10.8946 9.73478 11 10 11C10.2652 11 10.5196 10.8946 10.7071 10.7071C10.8946 10.5196 11 10.2652 11 10C11 9.73478 10.8946 9.48043 10.7071 9.29289ZM6.7071 9.29289C6.51957 9.10535 6.26521 9 6 9C5.73478 9 5.48043 9.10535 5.29289 9.29289C5.10535 9.48043 5 9.73478 5 10C5 10.2652 5.10535 10.5196 5.29289 10.7071C5.48043 10.8946 5.73478 11 6 11C6.26521 11 6.51957 10.8946 6.7071 10.7071C6.89464 10.5196 7 10.2652 7 10C7 9.73478 6.89464 9.48043 6.7071 9.29289ZM14.7071 9.29289C14.5196 9.10535 14.2652 9 14 9C13.7348 9 13.4804 9.10535 13.2929 9.29289C13.1054 9.48043 13 9.73478 13 10C13 10.2652 13.1054 10.5196 13.2929 10.7071C13.4804 10.8946 13.7348 11 14 11C14.2652 11 14.5196 10.8946 14.7071 10.7071C14.8946 10.5196 15 10.2652 15 10C15 9.73478 14.8946 9.48043 14.7071 9.29289Z"
          />
        </svg>
      )
  }
}

export default Icon