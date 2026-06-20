import Breadcrumb from '@/components/ui/Breadcrumb';
export const metadata = { title: 'About Us', description: 'Learn about MiniVersePrints' };
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'About Us' }]} />
      <h1 className="text-3xl font-bold mb-6">About MiniVersePrints</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-foreground-muted">
        <p>MiniVersePrints is a Sri Lankan 3D printing studio specialising in premium figures, busts, miniatures, and collectibles. Every piece is crafted with precision and passion using advanced 3D printing technology.</p>
        <h2 className="text-foreground">Our Mission</h2>
        <p>To bring your favourite characters to life through high-quality 3D-printed collectibles, delivered right to your doorstep across Sri Lanka.</p>
        <h2 className="text-foreground">What We Offer</h2>
        <ul>
          <li>Anime, superhero, and gaming figures</li>
          <li>Custom-made figures tailored to your specifications</li>
          <li>Bust sculptures and desk decorations</li>
          <li>Funko-style personalised figures</li>
          <li>Ready-stock and made-to-order options</li>
        </ul>
        <h2 className="text-foreground">Quality Promise</h2>
        <p>Each figure undergoes thorough quality checking before dispatch. We use premium PLA+ materials and offer both painted and unpainted options to suit every collector.</p>
      </div>
    </div>
  );
}
