import React from 'react'
import { BiAlarm, BiBarChart, BiBookReader, BiEdit } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { fetchUserData } from '../../hooks'
import { getTotalFormattedReadTime } from '../../logic'
import { getFirstLetter } from '../../logic/utils'
import { useUserStore } from '../../stores/UserStore'
import { Button } from '../atoms'

export const ProfileMenu = () => {
  const navigate = useNavigate()
  const fetcher = fetchUserData()
  const { userData } = useUserStore()

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:gap-20">
        <div className="flex flex-col justify-center mx-auto gap-3">
          <div className="mx-auto">
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content w-24 mask mask-hexagon">
                <span className="text-3xl">
                  {userData.username !== '' ? getFirstLetter(userData?.username) : '-'}
                </span>
              </div>
            </div>
          </div>
          <span className="mx-auto text-2xl font-bold">{userData?.username}</span>
          <span className="mx-auto text-xl font-normal">{userData?.email}</span>
          <Button text="Edit Profile" onClick={() => navigate(`/profile/edit/${userData.userId}`)}>
            <BiEdit size={24} className="ml-2" />
          </Button>
        </div>

        <div className="flex flex-col justify-center items-center mx-auto gap-3 w-full">
          <span className="text-xl sm:text-2xl">Overview Latihan</span>
          <div className="stats stats-vertical sm:stats-horizontal shadow w-full sm:w-fit bg-slate-100 mb-6">
            <div className="stat">
              <div className="stat-figure text-primary">
                <BiBookReader size={32} className="ml-2" />
              </div>
              <div className="stat-title text-xl text-black font-bold">Total latihan</div>
              <div className="stat-value text-primary">
                {fetcher.isLoading
                  ? 'Loading...'
                  : userData.trainings.length !== 0 && fetcher.isError !== true
                  ? userData.trainings.length
                  : '0'}
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-primary">
                <BiAlarm size={32} className="ml-2" />
              </div>
              <div className="stat-title text-xl text-black font-bold">Total waktu membaca</div>
              <div className="stat-value text-primary">
                {fetcher.isLoading
                  ? 'Loading...'
                  : userData.trainings.length !== 0 && fetcher.isError !== true
                  ? getTotalFormattedReadTime(userData.trainings)
                  : getTotalFormattedReadTime([])}
              </div>
            </div>
          </div>

          <span className="text-xl sm:text-2xl">Lihat detail progress latihan</span>
          <Button
            text="My Progress"
            weight="primary"
            onClick={() => navigate(`/profile/progress/${userData.userId}`)}
          >
            <BiBarChart size={24} className="ml-2" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col mx-auto gap-2"></div>
    </>
  )
}
