import { motion, useScroll, useTransform } from "framer-motion";
import rosaFolhas from "../assets/decor/rosa-folhas.png";
import gerberaBranca from "../assets/decor/gerbera-branca.png";
import florSeca from "../assets/decor/flor-seca.png";
import ramoFlores from "../assets/decor/ramo-flores.png";
import folhas1 from "../assets/decor/folhas-1.png";
import duasFolhas from "../assets/decor/2-folhas.png";
import petalasRosas1 from "../assets/decor/petalas-rosas-1.png";
import petalaBranca from "../assets/decor/petala-branca.png";

/**
 * Camada decorativa fixa (parallax). Mesma mecânica do convite da Sofia,
 * com flores brancas, folhagens e tons dessaturados — clima de casamento.
 * Desempenho: nenhuma imagem usa filtro CSS (blur/saturate/drop-shadow) —
 * o tom suave já está "embutido" nos PNGs, que foram reduzidos ao tamanho de
 * exibição. Cada camada usa `will-change: transform` (vai para a GPU).
 */

const FlowerGarden = () => {
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -320]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden>
      {/* Ramo principal — canto superior esquerdo */}
      <motion.img
        decoding="async"
        fetchPriority="low"
        src={rosaFolhas}
        alt=""
        className="absolute will-change-transform -top-32 -left-10 w-64 md:w-96 opacity-50"
        style={{ y: y2, zIndex: 1 }}
      />

      {/* Gerbera branca — esquerda, meio */}
      <motion.img
        decoding="async"
        fetchPriority="low"
        src={gerberaBranca}
        alt=""
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 0.35, x: 0 }}
        transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
        className="absolute will-change-transform top-[30%] -left-16 md:-left-20 w-52 md:w-72"
        style={{ y: y2, zIndex: 0 }}
      />

      {/* Folhagem — canto superior direito */}
      <motion.img
        decoding="async"
        fetchPriority="low"
        src={folhas1}
        alt=""
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 0.45, x: 0 }}
        transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
        className="absolute will-change-transform -top-6 -right-10 w-44 md:w-64"
        style={{ y: y3, rotate: 200, zIndex: 2 }}
      />

      {/* Flor seca delicada — direita */}
      <motion.img
        decoding="async"
        fetchPriority="low"
        src={florSeca}
        alt=""
        className="absolute will-change-transform top-[22%] right-[6%] w-28 opacity-30"
        style={{ y: y1, rotate: -20, zIndex: 1 }}
      />

      {/* Ramo — direita, baixo */}
      <motion.img
        decoding="async"
        fetchPriority="low"
        src={ramoFlores}
        alt=""
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 0.45, x: 0 }}
        transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
        className="absolute will-change-transform bottom-[8%] -right-10 md:-right-14 w-32 md:w-44"
        style={{ y: y1, zIndex: 2 }}
      />

      {/* Duas folhas — esquerda, baixo */}
      <motion.img
        decoding="async"
        fetchPriority="low"
        src={duasFolhas}
        alt=""
        className="absolute will-change-transform bottom-[6%] left-[-4%] w-36 opacity-35"
        style={{ y: y2, rotate, zIndex: 1 }}
      />

      {/* Pétalas flutuantes */}
      <motion.img
        decoding="async"
        fetchPriority="low"
        src={petalasRosas1}
        alt=""
        className="absolute will-change-transform top-1/4 left-1/3 w-10 opacity-40"
        animate={{ y: [0, 20, 0], x: [0, 10, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ zIndex: 3 }}
      />
      <motion.img
        decoding="async"
        fetchPriority="low"
        src={petalaBranca}
        alt=""
        className="absolute will-change-transform top-1/2 right-1/4 w-10 opacity-60"
        animate={{ y: [0, -30, 0], x: [0, -15, 0], rotate: [0, -60, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ zIndex: 3 }}
      />
    </div>
  );
};

export default FlowerGarden;
