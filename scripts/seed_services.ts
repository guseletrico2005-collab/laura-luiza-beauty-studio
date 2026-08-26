import { Firestore } from '@google-cloud/firestore';
import { INITIAL_SERVICES } from '../src/data/mockData';

async function seed() {
  const db = new Firestore({
    projectId: 'liquid-pager-jn96h',
    databaseId: 'ai-studio-lauraluzabeauty-e78c5fc8-643c-4ced-b4ac-7e9fa33e5e86'
  });

  console.log('Testing Firestore connection and querying services collection...');
  const snapshot = await db.collection('services').get();
  console.log(`Current documents count in services collection: ${snapshot.size}`);

  const existingIds = new Set<string>();
  snapshot.forEach(doc => {
    existingIds.add(doc.id);
  });

  console.log('Existing document IDs:', Array.from(existingIds));

  let createdCount = 0;
  let skippedCount = 0;
  const createdIds: string[] = [];
  const now = new Date().toISOString();

  for (const srv of INITIAL_SERVICES) {
    if (existingIds.has(srv.id)) {
      console.log(`Service ${srv.id} already exists, skipping.`);
      skippedCount++;
    } else {
      const docData = {
        id: srv.id,
        name: srv.name,
        category: srv.category,
        price: Number(srv.price),
        duration: Number(srv.durationMinutes || srv.duration || 60),
        durationMinutes: Number(srv.durationMinutes || srv.duration || 60),
        durationFormatted: srv.durationFormatted || '1h 00min',
        active: srv.isActive !== undefined ? srv.isActive : (srv.active !== undefined ? srv.active : true),
        isActive: srv.isActive !== undefined ? srv.isActive : (srv.active !== undefined ? srv.active : true),
        isPopular: Boolean(srv.isPopular || srv.popular),
        popular: Boolean(srv.isPopular || srv.popular),
        description: srv.description || '',
        fullDescription: srv.fullDescription || '',
        image: srv.image || '',
        highlights: srv.highlights || [],
        createdAt: srv.createdAt || now,
        updatedAt: srv.updatedAt || now
      };

      await db.collection('services').doc(srv.id).set(docData);
      console.log(`Created service doc: ${srv.id} - ${srv.name}`);
      createdCount++;
      createdIds.push(srv.id);
    }
  }

  console.log('\n--- VERIFICATION AFTER SEED ---');
  const verifySnapshot = await db.collection('services').get();
  console.log(`Total documents in 'services' collection now: ${verifySnapshot.size}`);
  
  verifySnapshot.forEach(doc => {
    const data = doc.data();
    console.log(`- [${doc.id}] ${data.name} | R$ ${data.price} | ${data.durationFormatted} | Categoria: ${data.category} | Ativo: ${data.isActive}`);
  });

  console.log('\nSummary:');
  console.log(`Created: ${createdCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Total: ${verifySnapshot.size}`);
}

seed().catch(err => {
  console.error('Error during seed:', err);
  process.exit(1);
});
