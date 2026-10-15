/**
 * Fallback mock data — Supabase unreachable veya hata verdiğinde kullanılır.
 */

const RAW_FAILS = [
  {
    id: '25068795-edd6-4e25-934f-d099eb4063d8',
    title: '2.5 years of records were nuked in an instant.',
    description:
      "Claude Code deleted developers' production setup, including its database and snapshots.",
    categories:
      '[{"id": "1554e468-db81-496a-83a2-c99452fbebdc", "name": "Faulty Operation", "created_at": "2026-03-17T22:50:46.985823+00:00"}, {"id": "fa243ddb-34e8-4d49-b9af-0d617aa616b7", "name": "Data Corruption", "created_at": "2026-03-17T22:50:46.985823+00:00"}]',
    author: 'x',
    url: 'https://x.com/Pirat_Nation/status/2030524162373046319',
    date: '2026-03-08',
    created_at: '2026-03-17 23:44:14.336907+00',
    updated_at: '2026-03-17 23:44:14.336907+00',
  },
  {
    id: '406045de-8da5-4bed-9745-a6b59fdd3fdf',
    title: 'Employee Automatically Terminated by Computer Program',
    description:
      'An employee was laid off, allegedly by an artificially intelligent personnel system, and blocked.',
    categories:
      '[{"id": "1554e468-db81-496a-83a2-c99452fbebdc", "name": "Faulty Operation", "created_at": "2026-03-17T22:50:46.985823+00:00"}]',
    author: 'Sean McGregor',
    url: 'https://incidentdatabase.ai/cite/35/',
    date: '2018-10-18',
    created_at: '2026-03-17 23:29:25.754201+00',
    updated_at: '2026-03-17 23:29:25.754201+00',
  },
  {
    id: '720585c9-9806-43e6-8be8-9b02aee794c5',
    title: 'An AI broke out of its system and secretly started using its own training GPUs to mine crypto.',
    description:
      "This is a real incident report from Alibaba's AI research team.The AI figured out that compute money",
    categories:
      '[{"id": "327c0d3d-703d-40ce-bc2a-dbe4b49be427", "name": "Security Vulnerability", "created_at": "2026-03-17T22:50:46.985823+00:00"}]',
    author: 'Alibaba tech report',
    url: 'https://x.com/JoshKale/status/2030116466104643633',
    date: '2026-03-06',
    created_at: '2026-03-17 23:54:18.850698+00',
    updated_at: '2026-03-17 23:54:18.850698+00',
  },
  {
    id: 'a6859d96-4724-4f1b-a3b7-6ff40fe52bbd',
    title: 'An AI agent deleted 25,000 documents from the wrong database. One second of distraction.',
    description:
      'If you used to apply 10 security measures, now you need 20. Good practices have never been more esse',
    categories:
      '[{"id": "fa243ddb-34e8-4d49-b9af-0d617aa616b7", "name": "Data Corruption", "created_at": "2026-03-17T22:50:46.985823+00:00"}, {"id": "1554e468-db81-496a-83a2-c99452fbebdc", "name": "Faulty Operation", "created_at": "2026-03-17T22:50:46.985823+00:00"}]',
    author: 'Reddit',
    url: 'https://www.reddit.com/r/ClaudeAI/comments/1rshuz9/an_ai_agent_deleted_25000_documents_from_the/',
    date: '2026-03-13',
    created_at: '2026-03-19 13:54:03.578493+00',
    updated_at: '2026-03-19 13:54:03.578493+00',
  },
  {
    id: 'fc6b9134-0017-49ce-8a2a-cd9c4496e477',
    title: 'Google Gemini CLI Reportedly Deletes User Files After Misinterpreting Command Sequence',
    description:
      "Product manager Anuraag Gupta reported that Google's Gemini CLI AI coding assistant permanently dele",
    categories:
      '[{"id": "fa243ddb-34e8-4d49-b9af-0d617aa616b7", "name": "Data Corruption", "created_at": "2026-03-17T22:50:46.985823+00:00"}, {"id": "1554e468-db81-496a-83a2-c99452fbebdc", "name": "Faulty Operation", "created_at": "2026-03-17T22:50:46.985823+00:00"}]',
    author: 'Anuraag Gupta',
    url: 'https://github.com/google-gemini/gemini-cli/issues/4586',
    date: '2025-07-21',
    created_at: '2026-03-19 13:38:28.227645+00',
    updated_at: '2026-03-19 13:38:28.227645+00',
  },
] as const;

/**
 * categories alanı DB'de JSON string olarak saklanıyor — parse edip IFailItem formatına çeviriyoruz.
 */
function parseFail(raw: (typeof RAW_FAILS)[number]): IFailItem {
  const categories: IFailCategory[] =
    typeof raw.categories === 'string' ? JSON.parse(raw.categories) : raw.categories;

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    categories,
    author: raw.author,
    url: raw.url,
    date: raw.date,
  };
}

export const MOCK_FAILS: IFailItem[] = RAW_FAILS.map(parseFail);

export const MOCK_CATEGORIES: IFailCategory[] = [
  { id: '1554e468-db81-496a-83a2-c99452fbebdc', name: 'Faulty Operation', created_at: '2026-03-17T22:50:46.985823+00:00' },
  { id: 'fa243ddb-34e8-4d49-b9af-0d617aa616b7', name: 'Data Corruption', created_at: '2026-03-17T22:50:46.985823+00:00' },
  { id: '327c0d3d-703d-40ce-bc2a-dbe4b49be427', name: 'Security Vulnerability', created_at: '2026-03-17T22:50:46.985823+00:00' },
  { id: '6a0b5e72-8c1d-4f3a-9e7b-2d4c6f8a1b3e', name: 'Ethical Violation' },
  { id: '8b2c7d93-1e4f-5a6b-0c8d-3f5e7a9b2c4d', name: 'Systematic Error' },
  { id: '9c3d8e04-2f5a-6b7c-1d9e-4a6f8b0c3d5e', name: 'Operation Errors' },
  { id: '0d4e9f15-3a6b-7c8d-2e0f-5b7a9c1d4e6f', name: 'User Errors' },
  { id: '1e5f0a26-4b7c-8d9e-3f1a-6c8b0d2e5f7a', name: 'Request-Oriented Operation' },
  { id: '2f6a1b37-5c8d-9e0f-4a2b-7d9c1e3f6a8b', name: 'Other' },
];

