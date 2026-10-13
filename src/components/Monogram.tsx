import { useId } from "react";
import { COUPLE } from "@/config/wedding";

/**
 * Monograma do casal (substitui o MsLogo do convite da Sofia).
 * Iniciais em Cormorant Garamond + "&" em Great Vibes, dentro de um
 * aro duplo fino com gradiente verde escuro → oliva → azul.
 */
interface MonogramProps {
  className?: string;
  colors?: { start: string; middle: string; end: string };
}

const Monogram = ({
  className,
  colors = { start: "#395135", middle: "#8D9F77", end: "#7AA7D0" },
}: MonogramProps) => {
  const id = useId().replace(/:/g, "");
  const grad = `mono-grad-${id}`;
  const { left, right } = COUPLE.initials;

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={`${COUPLE.bride} & ${COUPLE.groom}`}>
      <defs>
        <linearGradient id={grad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.start} />
          <stop offset="50%" stopColor={colors.middle} />
          <stop offset="100%" stopColor={colors.end} />
        </linearGradient>
      </defs>

      {/* Aro duplo */}
      <circle cx="200" cy="200" r="186" fill="none" stroke={`url(#${grad})`} strokeWidth="1.5" />
      <circle cx="200" cy="200" r="174" fill="none" stroke={`url(#${grad})`} strokeWidth="0.75" strokeDasharray="2 6" />

      {/* Pequenos ornamentos nos pontos cardeais */}
      {[
        [200, 14],
        [200, 386],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy}) rotate(45)`}>
          <rect x="-5" y="-5" width="10" height="10" fill="#F6FAFD" stroke={`url(#${grad})`} strokeWidth="1.5" />
        </g>
      ))}

      {/* Iniciais — V e W quase se tocando, com o "&" azul por cima entre elas.
          Posições calculadas a partir das medidas reais das fontes. O "&" é
          desenhado por último e tem um contorno fino da cor do fundo para
          continuar legível onde encosta nas letras. */}
      <text
        x="119.1"
        y="253.5"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', serif"
        fontWeight={500}
        fontSize="170"
        fill={`url(#${grad})`}
      >
        {left}
      </text>
      <text
        x="258.9"
        y="253.5"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', serif"
        fontWeight={500}
        fontSize="170"
        fill={`url(#${grad})`}
      >
        {right}
      </text>
      <text
        x="171.7"
        y="230.9"
        textAnchor="middle"
        fontFamily="'Great Vibes', cursive"
        fontSize="92"
        fill="#7AA7D0"
        stroke="#F6FAFD"
        strokeWidth="5"
        paintOrder="stroke"
      >
        &amp;
      </text>
    </svg>
  );
};

export default Monogram;
