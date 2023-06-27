import { Icon } from '@iconify/react';
const people = [
  {
    name: 'Leonardo Silva',
    role: 'Front-end Developer',
    imageUrl:
      'https://github.com/LeoUpperThrower4.png',
    githubUrl: 'https://github.com/LeoUpperThrower4',
  },
  {
    name: 'Rafael Huszcza',
    role: 'Back-end Developer',
    imageUrl: 'https://github.com/RafaelHuszcza.png',
    githubUrl: 'https://github.com/RafaelHuszcza',
  },
  {
    name: 'Lucas Machado',
    role: 'Back-end Developer',
    imageUrl: 'https://github.com/machadoluca.png',
    githubUrl: 'https://github.com/machadoluca',
  },
  {
    name: 'Rafael Coelho',
    role: 'Front-end Developer',
    imageUrl: 'https://github.com/rafshow.png',
    githubUrl: 'https://github.com/rafshow',
  }
]

export default function Team() {
  return (
    <div className="bg-gray-900 pb-24 sm:py-32">

      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Integrantes</h2>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 flex flex-wrap gap-6 max-w-5xl justify-center "
        >
          {people.map((person) => (
            <li key={person.name} className="rounded-2xl bg-gray-800 px-8 py-10">
              <img className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56" src={person.imageUrl} alt="" />
              <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-white">{person.name}</h3>
              <p className="text-sm leading-6 text-gray-400">{person.role}</p>
              <ul role="list" className="mt-6 flex justify-center gap-x-6">
                <li>
                  <a target='_blank' href={person.githubUrl} className="text-gray-400 hover:text-gray-300">

                    <span className="sr-only">Github</span>
                    <Icon icon="mdi:github" width={40} />

                  </a>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
