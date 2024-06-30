export const generateMessage = (): BlastTable => {
  return {
    id: String(Math.random()*1000),
    jobTitle: 'Blast query',
    db: 'human_genome',
    algorithm: 'blastn',
    status: 'In progress',
    created_at: '22/07/2001',
  };
};