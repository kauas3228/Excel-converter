import { useState, useRef } from 'react';
import './App.css';
import { Table } from 'react-bootstrap';
import { read, utils } from 'xlsx';
import { useDownloadExcel } from 'react-export-table-to-excel';


function Excel() {


  // Download Table
  
  const tableRef = useRef(null);

  const {onDownload} = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'Lista de vendas',
    sheet: 'Lista de vendas'
  })

  // Onchange States
  
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [isActive, setisActive] = useState(false);
  const [isDrop, setDrop] = useState([]);
  const [tables, setTables] = useState([]);
  // Submit states

  const [excelData, setExcelData] = useState(null);

  // onChange event

  const handleFile = (e) => {
    let filesType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text.csv', 'application/vnd.ms-excel'];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && filesType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        }
      } else {
        setTypeError('Por favor envie um arquivo válido');
        setExcelFile(null);
      }
    }
    else {
    }
  }

  // Submit event

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = utils.sheet_to_json(worksheet);
      setExcelData(data.slice(0, 10));
      const fixTable = tables;
      fixTable.push(data.slice(0, 10));
      setTables(fixTable);
      const fixDrop = isDrop;
      fixDrop.push(data.slice(0, 10));
      setDrop(fixDrop);
    }
  }
  console.log(isActive);
  return (
    <div className="wrapper">

      <h3>Envie e veja seus arquivos excel!!</h3>

      <form className='form-group custom-form' onSubmit={handleFileSubmit}>
        <input type='file' className='form-control' required onChange={handleFile} />
        <button type='submit' className='btn btn-success btn-lg'>Upload</button>
        {typeError && (
          <div className='alert alert-danger' role='alert'>{typeError}</div>
        )}
      </form>

      <div className='viewer'>

        <div className="dropdown">
          
          <div className="dropdown__btn" onClick={(e) => setisActive(!isActive)}>Lista 
          <button onClick={onDownload}>Download</button></div>
          {isActive && (
            <div className="dropdown__content">
              <div className="dropdown__item">
                {excelData ? (tables.map(excelData => (

                  <Table responsive striped bordered hover ref={tableRef}>
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
                ))
                ) : (
                  <div>Nenhum arquivo enviado</div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

    </div>

  );

}

export default Excel;

