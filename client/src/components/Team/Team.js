import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import './Team.css';
import { Context } from '../../Context/Context';
import { SERVER_URL } from '../../EditableStuff/Config';

const TeamCard = React.lazy(() => import('./TeamCard'));

function Team() {
  const [teams, setTeams] = useState([]);
  const [archTeam, setArchTeam] = useState(false);
  const [msg, setMsg] = useState();

  const d = new Date();
  var y = d.getFullYear();
  const ly = 2019;
  const years = Array.from(
    { length: y - ly + 1 },
    (value, index) => {
      return (ly + index);
    });
  years.reverse();
  const [year, setYear] = useState(y + 1);

  const { user, logged_in } = useContext(Context);
  const getTeamData = async () => {
    axios.get(`${SERVER_URL}/getTeam/${year}`)
      .then(data => {
        setTeams(data.data);
        setArchTeam(false);
      });
  }

  const getArchTeamData = async () => {
    axios.get(`${SERVER_URL}/getArchTeam`)
      .then(data => {
        setTeams(data.data);
        setArchTeam(true);
      })
  }

  useEffect(() => {
    if (archTeam) {
      getArchTeamData();
    }
    else {
      getTeamData();
    }
  }, [logged_in]);

  useEffect(() => {
    getTeamData();
  }, [year])

  return (
    <>
      <Helmet>
        <title>Team - AI Club</title>
      </Helmet>
      <div className='team-container'>
        <div className='head-img'>
          <h1>Team Members</h1>
        </div>
          <div className='container team py-4'>
              <div className='row align-items-center pb-1'>
                <div className='col-12 col-md-4 align-items-center h3 pt-3 text-center text-md-start'>
                  {archTeam && <span>Archieved</span>} Team Members
                </div>
                <div className='col-12 col-md-5 text-center text-md-end align-items-center'>
                  {
                    user?user.isadmin?
                      <div className='right-panel'>
                        {
                          archTeam?
                            <NavLink rel="noreferrer" className='btn mx-2' onClick={getTeamData}>
                              Team
                            </NavLink>
                          :
                            <NavLink rel="noreferrer" className='btn mx-2' onClick={getArchTeamData}>
                              Archieved
                            </NavLink>
                        }
                        <NavLink className='btn btn-primary mx-2' to='/team/add'>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-plus-circle-fill"
                            viewBox="0 0 16 18"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                          </svg>
                          {' '}Add
                      </NavLink>
                      </div>
                    :'':''
                  }
                </div>
                
                <div className='right-panel col-12 col-md-3 text-center'>
                  <select name="year" value={year} onChange={(e)=>setYear(e.target.value)} className="form-select" aria-label="year">
                    {/* <option value="">Select Year</option> */}
                      <option value={y+1}>Present</option>
                    {/* <option value={year}>Present</option> */}

                    {
                      archTeam ?
                        <button rel="noreferrer" className='btn mx-2' onClick={getTeamData}>
                          Team
                        </button>
                        :
                        <button rel="noreferrer" className='btn mx-2' onClick={getArchTeamData}>
                          Archieved
                        </button>
                    }
                    <button rel="noreferrer" className='btn mx-2' >
                      Sort
                    </button>
                    <NavLink className='btn btn-primary mx-2' to='/team/add'>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-plus-circle-fill"
                        viewBox="0 0 16 18"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                      </svg>
                      {' '}Add
                    </NavLink>
                  </div>
                  : '' : ''
              }
            </div>

            <div className='right-panel col-12 col-md-3 text-center'>
              <select name="year" value={year} onChange={(e) => setYear(e.target.value)} className="form-select" aria-label="year">
                {/* <option value="">Select Year</option> */}
                <option value={y + 1}>Present</option>
                {/* <option value={year}>Present</option> */}
                {
                  years.map((yr) => {
                    return (<option value={yr}>{yr}</option>)
                  })
                }
              </select>
            </div>
          </div>
          <div className='msg'>
            {
              msg ?
                <span>{msg}</span>
                :
                null
            }
          </div>
          {/* <h4>Team Members</h4> */}
          <div className='row'>
            {
              teams.map(team => {
                return (
                  <TeamCard team={team} isadmin={user ? user.isadmin : false} isdelete={user ? user.username === team.username : false} />
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Team