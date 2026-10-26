import type { Status } from '../components/ui/StatusIcon.astro';

/* ---------- Regiões (séries de gráfico: índigo, branco, cinza + traço) ---------- */

export const regions = [
  { id: 'gru', name: 'São Paulo', short: 'SAO', color: '#6798ff', dash: '' },
  { id: 'iad', name: 'Virgínia, EUA', short: 'IAD', color: '#ffffff', dash: '5 4' },
  { id: 'fra', name: 'Frankfurt', short: 'FRA', color: '#7c7c7c', dash: '2 3' },
] as const;

/* ---------- Dashboard (dados ilustrativos) ---------- */

export interface Monitor {
  name: string;
  url: string;
  status: Status;
  uptime: string;
  p95: string;
  /** 45 dias, mais antigo → mais recente */
  history: Status[];
}

const days = (incidents: Record<number, Status> = {}): Status[] =>
  Array.from({ length: 45 }, (_, i) => incidents[i] ?? 'up');

export const monitors: Monitor[] = [
  { name: 'API pública', url: 'api.loja.com.br/health', status: 'up', uptime: '99,99%', p95: '142 ms', history: days({ 17: 'degraded' }) },
  { name: 'Checkout', url: 'loja.com.br/checkout', status: 'degraded', uptime: '99,91%', p95: '612 ms', history: days({ 30: 'degraded', 43: 'degraded', 44: 'degraded' }) },
  { name: 'Webhooks de pagamento', url: 'hooks.loja.com.br', status: 'down', uptime: '99,62%', p95: '—', history: days({ 9: 'down', 44: 'down' }) },
  { name: 'Painel administrativo', url: 'admin.loja.com.br', status: 'up', uptime: '100%', p95: '208 ms', history: days() },
];

export interface TimelineEvent {
  time: string;
  title: string;
  detail: string;
  kind: 'detect' | 'confirm' | 'alert' | 'ack' | 'resolve';
}

export const incident = {
  title: 'Webhooks de pagamento retornando 503',
  monitor: 'hooks.loja.com.br',
  events: [
    { time: '14:02:08', kind: 'detect', title: 'Falha detectada em São Paulo', detail: 'HTTP 503 em 2 checagens seguidas' },
    { time: '14:02:31', kind: 'confirm', title: 'Confirmado por Virgínia e Frankfurt', detail: '3 de 3 regiões concordam: queda real' },
    { time: '14:02:33', kind: 'alert', title: 'Alerta enviado ao plantão', detail: 'Slack #plantao e WhatsApp para Marina' },
    { time: '14:07:33', kind: 'alert', title: 'Escalonado por falta de resposta', detail: 'Ligação telefônica para Diego' },
    { time: '14:08:12', kind: 'ack', title: 'Reconhecido por Diego', detail: 'Investigando o worker de filas' },
    { time: '14:21:40', kind: 'resolve', title: 'Resolvido', detail: 'Worker reiniciado com mais memória' },
  ] as TimelineEvent[],
};

/* ---------- Números do produto (fatos do briefing, não métricas de mercado) ---------- */

export const stats = [
  { icon: 'globe', value: '3 regiões', label: 'confirmam cada queda', text: 'São Paulo, Estados Unidos e Europa checam juntos antes de qualquer alerta.' },
  { icon: 'clock', value: '< 2 min', label: 'até o primeiro alerta', text: 'Cole a URL, escolha o canal e receba um alerta de teste de verdade.' },
  { icon: 'bell', value: '6 canais', label: 'de alerta com escalonamento', text: 'E-mail, Slack, Discord, WhatsApp, SMS e ligação telefônica.' },
] as const;

export const integrations = ['Slack', 'Discord', 'WhatsApp', 'OpenTelemetry', 'ClickHouse', 'JavaScript', 'Python', 'PHP'];

/* ---------- Como funciona ---------- */

export const setupSteps = [
  { title: 'Cole a URL', text: 'Endereço, método e o que conta como resposta saudável. O resto já vem preenchido com padrões sensatos.' },
  { title: 'Escolha quem é avisado', text: 'Conecte Slack, Discord ou WhatsApp com um clique, ou fique só com o e-mail por enquanto.' },
  { title: 'Receba o alerta de teste', text: 'Disparamos um alerta real para você ver exatamente como ele chega, antes de precisar dele.' },
];

/* ---------- Alertas ---------- */

export const channels = ['E-mail', 'Slack', 'Discord', 'WhatsApp', 'SMS', 'Ligação telefônica'];

export const escalation = [
  { after: '0 min', who: 'Plantonista da semana', how: 'Slack e WhatsApp' },
  { after: '5 min sem resposta', who: 'Segundo nível', how: 'Ligação telefônica' },
  { after: '15 min sem resposta', who: 'Líder técnico', how: 'Ligação e SMS' },
];

/* ---------- Para quem ---------- */

export const benefits = [
  { icon: 'zap', title: 'Configura em minutos', text: 'Sem agente para instalar e sem YAML. Uma URL e um canal bastam para começar.', who: 'Dev' },
  { icon: 'search', title: 'Investiga sem trocar de aba', text: 'Do alerta ao log e ao stack trace do mesmo instante, com um clique.', who: 'Dev' },
  { icon: 'code', title: 'Usa o que já existe', text: 'OpenTelemetry, SDKs em JavaScript, Python e PHP e API REST para automatizar no CI.', who: 'Dev' },
  { icon: 'shield', title: 'Plantão que não esgota', text: 'Menos falso positivo, escalas justas e escalonamento automático por nível.', who: 'Time' },
  { icon: 'list', title: 'Histórico de cada incidente', text: 'Detecção, confirmação, alertas enviados e quem reconheceu, minuto a minuto.', who: 'Time' },
  { icon: 'broadcast', title: 'Comunicação com o cliente', text: 'Página de status pública que continua no ar mesmo com a plataforma fora.', who: 'Time' },
] as const;

/* ---------- SDK ---------- */

export const sdkSnippets = [
  {
    id: 'js',
    label: 'JavaScript',
    install: 'npm install @pulso/sdk',
    file: 'app.ts',
    code: `import { Pulso } from '@pulso/sdk';

Pulso.init({
  dsn: process.env.PULSO_DSN,
  environment: 'production',
  release: '2.4.1',
});

// Erros não tratados são capturados sozinhos.
// Para os tratados, envie com contexto:
try {
  await cobrar(pedido);
} catch (err) {
  Pulso.captureException(err, { pedidoId: pedido.id });
}`,
  },
  {
    id: 'python',
    label: 'Python',
    install: 'pip install pulso-sdk',
    file: 'main.py',
    code: `import os
import pulso

pulso.init(
    dsn=os.environ["PULSO_DSN"],
    environment="production",
    release="2.4.1",
)

# Integra com Django, Flask e FastAPI sem configuração extra.
try:
    cobrar(pedido)
except Exception as err:
    pulso.capture_exception(err, pedido_id=pedido.id)`,
  },
  {
    id: 'php',
    label: 'PHP',
    install: 'composer require pulso/sdk',
    file: 'bootstrap.php',
    code: `<?php
use Pulso\\Pulso;

Pulso::init([
    'dsn'         => getenv('PULSO_DSN'),
    'environment' => 'production',
    'release'     => '2.4.1',
]);

// Funciona com Laravel e Symfony.
try {
    cobrar($pedido);
} catch (\\Throwable $err) {
    Pulso::captureException($err, ['pedido_id' => $pedido->id]);
}`,
  },
];

export const otelSnippet = `# Qualquer app já instrumentado com OpenTelemetry
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.pulso.dev
OTEL_EXPORTER_OTLP_HEADERS="x-pulso-key=\${PULSO_KEY}"
OTEL_SERVICE_NAME=checkout-api`;

/* ---------- Planos ---------- */
/* Limites não definidos no briefing ficam como [N] para preencher. */

export const plans = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    period: 'para sempre',
    summary: 'Para projetos pessoais e para conhecer o Pulso.',
    cta: 'Criar conta grátis',
    featured: false,
    features: [
      '10 monitores de URL',
      'Checagem em São Paulo, EUA e Europa',
      'Alertas por e-mail, Slack e Discord',
      'Página de status pública',
    ],
  },
  {
    name: 'Dev',
    price: 'R$ 49',
    period: '/mês',
    summary: 'Para quem mantém produtos em produção sozinho.',
    cta: 'Assinar o Dev',
    featured: true,
    features: [
      'Até [N] monitores',
      'Tudo do Grátis, mais WhatsApp e SMS',
      'Logs e métricas via OpenTelemetry',
      'Rastreamento de erros com stack trace',
      'Página de status com domínio próprio',
    ],
  },
  {
    name: 'Time',
    price: 'R$ 199',
    period: '/mês',
    summary: 'Para equipes com plantão e mais de um serviço crítico.',
    cta: 'Assinar o Time',
    featured: false,
    features: [
      'Até [N] monitores',
      'Tudo do Dev, mais ligação telefônica',
      'Escalas de plantão com escalonamento',
      'Membros e permissões por projeto',
      'Retenção estendida de logs',
    ],
  },
];

/* ---------- FAQ ---------- */

export const faq = [
  {
    q: 'Como o Pulso evita alarme falso?',
    a: 'Quando uma região detecta falha, as outras checam o mesmo endereço na hora. O alerta só sai quando a maioria concorda. Uma oscilação de rede em um único ponto fica registrada, mas não acorda ninguém.',
  },
  {
    q: 'A página de status cai junto com o resto?',
    a: 'Não. Ela é publicada como site estático, separado da plataforma. Se o Pulso inteiro parasse, a última versão continuaria no ar para os seus clientes.',
  },
  {
    q: 'Preciso trocar minha instrumentação para enviar logs?',
    a: 'Se você já usa OpenTelemetry, basta apontar o exportador para o nosso endpoint. Os dados vão para o ClickHouse, que consulta volumes grandes de logs em segundos.',
  },
  {
    q: 'O plano grátis tem limite de tempo?',
    a: 'Não. Os 10 monitores ficam disponíveis enquanto a conta estiver ativa, sem cartão de crédito.',
  },
  {
    q: 'Quais linguagens têm SDK de erros?',
    a: 'JavaScript (Node e navegador), Python e PHP. Cada erro chega com stack trace, versão do release e o contexto que você enviar.',
  },
];
