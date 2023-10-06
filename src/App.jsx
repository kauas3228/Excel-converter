import { useState } from 'react';
import './App.css';
import { Table } from 'react-bootstrap';
import { read, utils } from 'xlsx';


function App() {


  // Onchange States
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);

  // Submit states

  const [excelData, setExcelData] = useState(null);

  // onChange event

  const handleFile = (e) =>{
    let filesType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text.csv', 'application/vnd.ms-excel'];
    let selectedFile = e.target.files[0];
    if(selectedFile){
      if(selectedFile && filesType.includes(selectedFile.type)){
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        }
      }else{
        setTypeError('Por favor envie um arquivo válido');
        setExcelFile(null);
      }
    }
    else{
      
    }
  }

  // Submit event

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if(excelFile !== null){
      const workbook = read(excelFile, {type: 'buffer'});
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = utils.sheet_to_json(worksheet);
      setExcelData(data.slice(0,10));
    }
  }

  return (
    <div className="wrapper">
      
      <h3>Envie e veja seus arquivos excel</h3>

      <form className='form-group custom-form' onSubmit={handleFileSubmit}>
        <input type='file' className='form-control' required onChange={handleFile}/>
        <button type='submit' className='btn btn-success btn-lg'>Upload</button> 
        {typeError && (
          <div className='alert alert-danger' role='alert'>{typeError}</div>
        )}
      </form>

      <div className='viewer'>
        
        {excelData?(
          <Table responsive variant='dark' striped bordered hover>
            <thead>
              <tr>
                {Object.keys(excelData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {excelData.map((individualExcelData, index) => (
                <tr key={index}>
                  {Object.keys(individualExcelData).map((key) => (
                    <td key={key}>{individualExcelData[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>

          </Table>
        ):(
          <div>Nenhum arquivo enviado</div>
        )}

      </div>

    </div>
  );
}

export default App;
