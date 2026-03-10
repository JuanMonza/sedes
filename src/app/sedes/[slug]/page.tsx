import Link from 'next/link';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/animations/FadeIn';
import Button from '@/components/ui/Button';
import SedeCard from '@/components/cards/SedeCard';
import { getAllDepartamentos, getSedesByDepartamento } from '@/data/sedes';

interface SedesDepartamentoPageProps {
  params: {
    slug: string;
  };
}

export default function SedesDepartamentoPage({ params }: SedesDepartamentoPageProps) {
  const departamentos = getAllDepartamentos();
  const departamento = departamentos.find((dep) => dep.slug === params.slug);

  if (!departamento) {
    notFound();
  }

  const sedes = getSedesByDepartamento(params.slug);

  return (
    <>
      <section className="py-20 bg-gradient-to-b from-background to-white/50">
        <Container>
          <FadeIn>
            <SectionTitle
              title={`Sedes en ${departamento.nombre}`}
              subtitle={`${sedes.length} sedes en ${departamento.ciudades.length} ciudades`}
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {departamento.ciudades.map((ciudad) => (
                <span
                  key={ciudad}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                >
                  {ciudad}
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-8 flex justify-center">
              <Link href="/">
                <Button variant="secondary" size="md">
                  Ver todos los departamentos
                </Button>
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sedes.map((sede) => (
              <SedeCard key={sede.id} sede={sede} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
