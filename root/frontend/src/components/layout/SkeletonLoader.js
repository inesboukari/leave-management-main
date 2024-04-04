import React from 'react'

function SkeletonLoader() {
  /*Ce composant React, appelé SkeletonLoader, représente un indicateur de chargement de type squelette. 
  Il est souvent utilisé pour donner à l'utilisateur une indication visuelle que du contenu est en cours de chargement ou de traitement*/
  return (
    <div className="py-20 mx-auto rounded-sm shadow-md w-100 md:w-full h-1/3 animate-pulse dark:bg-gray-900">
      <div className="flex p-4 space-x-4 sm:px-8">
        <div className="flex-shrink-0 w-16 h-16 rounded-full dark:bg-gray-700"></div>
        <div className="flex-1 py-2 space-y-4">
          <div className="mb-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
          <div className="my-4 w-full h-4 rounded dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonLoader