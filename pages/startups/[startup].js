import React from 'react';
import { useRouter } from 'next/router';
// import { getAllProjects, getParticularProject } from '../../lib/db-admin';
import { db } from '../../lib/firebase-admin';

export const getStaticPaths = async () => {
  //   const { projects } = await getAllProjects();
  //   const snapshot = await db.collection('projects').get();

  //   const projects = [];
  //   snapshot.forEach((doc) => {
  //     projects.push(doc.data());
  //   });
  const snapshot = await db.collection('projects').get();

  const projects = [];
  snapshot.forEach((doc) => {
    projects.push({ id: doc.id, ...doc.data() });
  });

  const paths = projects.map((project) => ({
    params: {
      startup: project.projectName.toString(),
    },
  }));

  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  //   const { projects } = await getParticularProject(params.startup);
  let ref = db.collection('projects').where('projectName', '==', params.startup);

  const snapshot = await ref.get();
  const projects = [];

  snapshot.forEach((doc) => {
    projects.push({ id: doc.id, ...doc.data() });
  });
  // const snapshot = await db.collection('projects').get();

  // const projects = [];
  // snapshot.forEach((doc) => {
  //   projects.push({ id: doc.id, ...doc.data() });
  // });

  return {
    props: { projects },
    revalidate: 1,
  };
};

const StartupPage = ({ projects }) => {
  console.log(projects);
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h2>Welcome to the startup page!</h2>
      {projects && projects.map((project) => <p>{project.projectName}</p>)}
    </div>
  );
};

export default StartupPage;
