import { useState ,useEffect} from 'react';
import axios from 'axios';
// import Get from './gettask';
import '../style/addtask.css'
import EditTask from './update';


const Add = () => {
    const [taskName, setTaskName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [priority, setPriority] = useState('');
    const [posts, setPosts] = useState([]);
    const [findStartDate, setSearchStartDate] = useState('');
    const [findEndDate, setSearchEndDate] = useState('');
    
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
   
  
    const handleSubmit = (e) => {
      e.preventDefault();
    
      const data = {
        taskName,
        startDate,
        endDate,
        priority,
       
      };
    
      axios.post('http://localhost:5500/tasks', data)
        .then((response) => {
          alert(response.data.message);
          
        })
        .catch((error) => {
          alert(error.data.message);
         
        });
    };

    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get('http://localhost:5500/tasks');
              setPosts(response.data);
          } catch (error) {
              console.log(error);
          }
      };
      fetchData();
  }, []);
  const deleteTask = async (id) => {
    try {
        await axios.delete(`http://localhost:5500/tasks/${id}`);
        setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
        console.log(error);
    }
};

const updateTask = async (id, updatedData) => {
    try {
        const response = await axios.put(`http://localhost:5500/tasks/${id}`, updatedData);
        const updatedPost = response.data;
        const updatedPosts = posts.map((post) => {
            if (post._id === updatedPost._id) {
                return updatedPost;
            }
            return post;
        });
        setPosts(updatedPosts);
    } catch (error) {
        console.log(error);
    }
};



const filterPosts = () => {
    let filteredPosts = [...posts];

    if (findStartDate) {
        filteredPosts = filteredPosts.filter((x) => x.startDate.includes(findStartDate));
    }

    if (findEndDate) {
        filteredPosts = filteredPosts.filter((x) => x.endDate.includes(findEndDate));
    }

    return filteredPosts;
};

const indexOfLastRecord = currentPage * recordsPerPage;
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
const currentRecords = filterPosts().slice(indexOfFirstRecord, indexOfLastRecord);

const pageNumbers = [];
for (let i = 1; i <= Math.ceil(filterPosts().length / recordsPerPage); i++) {
    pageNumbers.push(i);
}

const renderPageNumbers = pageNumbers.map((number) => (
    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
        <button className="page-link" onClick={() => setCurrentPage(number)}>
            {number}
        </button>
    </li>
));

    return ( 
      <div className='aa'>
        <form className='a1' onSubmit={handleSubmit}>
        <h1 id='m1'><b> <u> GINIMS TASK MANAGEMENT</u></b> </h1>
        <div className='a3'>
          <label className='b1'><b>Task Name: </b> </label>
          <input  className='b1 text-dark' type="text" placeholder='enter task' value={taskName} onChange={(e) => setTaskName(e.target.value)} />
        </div>
        <div className='a3'> 
          <label className='b1'><b> Start Date:</b></label>
          <input className='b1 text-dark' type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div className='a3'>
          <label className='b1'><b> End Date:</b></label>
          <input  className='cb1' type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div className='a3'>
          <label className='b1'><b> Priority:</b></label>
          <br />
          <select  className='b11' value={priority} onChange={(e) => setPriority(e.target.value)} required>
            <option value="">--Select Priority--</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className='a6'>
          <button className='btn btn-dark'>Create Task</button>
        </div>
      </form>

      <hr/>
      <div className="div">
            <h1 className='text-drak '><b> <u> List of Tasks</u> </b></h1>
            <div className="row mb-">
                <div className="col-6">
                    <div className="input-group">
                        <span className="input-group-text" id="searchStartDate"><b> Search by Start Date: </b></span>
                        <input type="text"
                            className="form-control"
                            placeholder="MM/DD/YYYY"
                            aria-label="Search by Start Date"
                            aria-describedby="searchStartDate"
                            value={findStartDate}
                            onChange={(e) => setSearchStartDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-6">
                    <div className="input-group">
                        <span className="input-group-text " id="searchEndDate"><b> Search by End Date:</b></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="MM/DD/YYYY"
                            aria-label="Search by End Date"
                            aria-describedby="searchEndDate"
                            value={findEndDate}
                            onChange={(e) => setSearchEndDate(e.target.value)}
                        />
                    </div>
                </div>

              
                <div className="div mt-5  ">

                  <EditTask/>

                    <table className={`table `}>
                        <thead>
                            <tr>
                                <th scope="col">slno</th>
                                <th scope="col">Taskname</th>
                                <th scope="col">StartDate</th>
                                <th scope="col">EndDate</th>
                                <th scope="col">Priority</th>
                                <th scope="col">Action</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((Data) => (
                                <tr key={Data._id}>
                                    <td>{Data._id}</td>
                                    <td>{Data.taskName}</td>
                                    <td>{Data.startDate}</td>
                                    <td>{Data.endDate}</td>
                                    <td>{Data.priority}</td>
                                    <td>
                                        <button className='btn btn-outline-info' onClick={() => updateTask(Data._id, { ...Data, taskName: Data.taskName.current.value })}>
                                            {' '}
                                            edit
                                        </button>
                                        {/* {updatedPost===false  ? <button onClick={handleSubmit}>Add task</button> :
                                 <button onClick={updateTask}>update task</button>} */}
                                    </td>

                                    <td>
                                        <button className='btn btn-outline-danger' onClick={() => deleteTask(Data._id)}> delete</button>
                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>
                    <nav>
                        <ul className="pagination">
                            {renderPageNumbers}
                        </ul>
                    </nav>


                </div>
            </div>

        </div>
    
      </div>
     );
}
 
export default Add;



