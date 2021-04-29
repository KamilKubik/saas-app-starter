import Head from 'next/head';
import Header from '@components/Header';
import Footer from '@components/Footer';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import { db } from '../lib/firebase';

export default function Home() {
  const [inputValue, setInputValue] = useState();
  const router = useRouter();

  useEffect(async () => {
    const snapshot = await db.collection('projects').get();

    const projects = [];
    snapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    console.log(projects);
  }, []);

  const onProjectCreate = async () => {
    const projectId = uuidv4();
    const newProject = {
      projectId,
      projectName: inputValue,
    };
    await db.collection('projects').doc(projectId).set(newProject);
    router.push('/startups/[startup]', `/startups/${inputValue}`);
  };
  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Welcome to my app!" />
        <p className="description">
          Get started by editing <code>pages/index.js</code>
        </p>
        <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button onClick={onProjectCreate}>Create project!</button>
      </main>

      <Footer />
    </div>
  );
}
