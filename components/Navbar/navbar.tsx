import React from 'react'
import style from './nav.module.css'
import Link from 'next/link';

const navbar = () => {
  return (
    <div className={style.component}>
        <ul className={style.redirectContainer}>
        <Link href="/"><li>Accueil</li></Link>
        <Link href="problem"><li>Signaler un problème</li></Link>
        </ul>
    </div>
  )
}

export default navbar