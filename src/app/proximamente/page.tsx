import Link from 'next/link';
import Container from '@/components/ui/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';

export default function ProximamentePage() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-white/50 min-h-[60vh] flex items-center">
      <Container>
        <FadeIn>
          <SectionTitle
            title="Próximamente"
            subtitle="Estamos preparando esta sección. Muy pronto estará disponible."
          />
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto text-center border border-border">
            <p className="text-textLight">
              Por ahora puedes explorar nuestras sedes por departamento y ciudad.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/ubicaciones">
                <Button variant="primary" size="md">
                  Ver sedes
                </Button>
              </Link>
              <Link href="/">
                <Button variant="secondary" size="md">
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
