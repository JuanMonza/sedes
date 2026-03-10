import Container from '@/components/ui/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/animations/FadeIn';
import SedesExplorer from '@/components/sedes/SedesExplorer';
import { SEDES, getAllDepartamentos } from '@/data/sedes';

export default function HomePage() {
  const departamentos = getAllDepartamentos();

  return (
    <>
      <section className="py-20 bg-gradient-to-b from-background to-white/50">
        <Container>
          <FadeIn>
            <SectionTitle
              title="Sedes por Departamento"
              subtitle={`${SEDES.length} sedes en ${departamentos.length} departamentos de Colombia`}
            />
          </FadeIn>
        </Container>
      </section>

      <SedesExplorer departamentos={departamentos} sedes={SEDES} />
    </>
  );
}
