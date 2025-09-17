interface Project {
  id: string
  title: string
  url: string
}

export const ProjectCard = ({ project }: { project: Project }) => (
  <a
    href={project.url}
    target='_blank'
    className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition'
  >
    <h3 className='font-bold text-lg text-gray-900 dark:text-white'>
      {project.title}
    </h3>
    <p className='text-sm text-gray-500 dark:text-gray-300 mt-2 hover:text-indigo-500 transition'>
      View Project →
    </p>
  </a>
)
