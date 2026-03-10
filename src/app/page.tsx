import Container from '@/components/ui/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/animations/FadeIn';
import SedesExplorer from '@/components/sedes/SedesExplorer';
import { SEDES, getAllDepartamentos } from '@/data/sedes';

export default function HomePage() {
  const departamentos = getAllDepartamentos();
  const yearsExperience = 26; // Años de experiencia de JR en el sector de transporte y logística
  const stats = [
    { label: 'Sedes', value: SEDES.length },
    { label: 'Departamentos', value: departamentos.length },
    { label: 'Años de experiencia', value: yearsExperience },
  ];

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

          <FadeIn delay={0.15}>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass rounded-2xl p-6 text-center border border-border"
                >
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-textLight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>

      <SedesExplorer departamentos={departamentos} sedes={SEDES} />
    </>
  );
}
