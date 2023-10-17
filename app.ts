import express from "express";
import oracledb, {Connection, ConnectionAttributes} from "oracledb";

type Customresponse = {
    status: string;
    message: string;
    payload: any
};
// aplicando backeand web, com o framework express.
const app = express();
const port = 3000;

app.get("/", (req, res)=>{
    res.send("Estou funcionando... na rota default /")
});

app.get("/clientes", (req,res)=>{
    res.send("Listagem dos cleinetes cadastrados, vai aparecer aqui...")
});

//listen implementado para mostrar que o servidor está de pé.
app.listen(port, ()=>{
    console.log(`HTTP Server started on ${port} port`);
});

app.put("/incluiraeronave", async(req,res)=>{
    const Modelo = req.body.modelo as string;
    const NumeroID = req.body.numeroid as number;
    const Fabricante = req.body.fabricante as string;
    const Fabricacao = req.body.fabricacao as string; 
    const Escolha_o_assento = req.body.assento as string;

    let conn;

    let cr: Customresponse = {
        status: "Error",
        message: "",
        payload: undefined,
    };
    
    try{
        conn = await oracledb.getConnection({
            user:"bd190923119",
            password: "Lymjm5",
            connectionString: "BD-ACD:1521/xe"
        });
        
        const incluiraeronave = "INSERT INTO AERONAVES(MODELO, NUMEROID, FABRICANTE, FABRICACAO, ESCOLHA_O_ASSENTO, ID_AERONAVE)VALUES(1, :3, :4, :5, :2, SEQ_AERONAVES.NEXTVAL:)"
      const data = [Modelo, NumeroID, Fabricante, Fabricacao, Escolha_o_assento];
      let resInsert = await conn.execute(incluiraeronave, Date);
      await conn.commit();
      
      const rowsInserted = resInsert.rowsAffected
    if(rowsInserted !== undefined &&  rowsInserted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Aeronave inserida.";
    }

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    //fechar a conexao.
    if(conn!== undefined){
      await conn.close();
    }
    res.send(cr);  
  }
});
