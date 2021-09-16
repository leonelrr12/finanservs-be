using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using System.Xml.Serialization;

namespace GetScoreAPC
{
    public partial class PruebaWSAPC : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                APCFull Result = UsingXMLDocument();
                Console.ReadKey();
            }
        }

        public APCFull UsingXMLDocument()
        {
            //0-509-1938 y 0-509-1939
            string usuarioconsulta = APCEncrypt.ScorePlusEncrypt.EncryptString("WSACSORAT001");
            string claveConsulta = APCEncrypt.ScorePlusEncrypt.EncryptString("Rqh&s7E&jN");
            string IdentCliente = APCEncrypt.ScorePlusEncrypt.EncryptString("0-509-1938");
            //string IdentCliente = APCEncrypt.ScorePlusEncrypt.EncryptString("0-509-1939");
            string TipoCliente = APCEncrypt.ScorePlusEncrypt.EncryptString("1");
            string Producto = APCEncrypt.ScorePlusEncrypt.EncryptString("1");


            ServiceReferenceAPC.apcscoreSoapClient ws = new ServiceReferenceAPC.apcscoreSoapClient();
            string ServiceResult = ws.ApcScore(usuarioconsulta, claveConsulta, IdentCliente, TipoCliente, Producto);

            //ServiceReferenceRealAPC.classicScorePlusServiceSoapClient ws = new ServiceReferenceRealAPC.classicScorePlusServiceSoapClient();
            //string ServiceResult = ws.GetScore(usuarioconsulta, claveConsulta, IdentCliente, TipoCliente, Producto);

            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.LoadXml(ServiceResult);

         
            XmlNodeList ItemNodes = xmlDoc.SelectNodes("//Resultado");

            APCFull APC = new APCFull();
            Generales[] arrayG = new Generales[1];
            Resumen[] arrayR = new Resumen[1];
            Detalle[] arrayD = new Detalle[1];
            ReferenciasCanceladas[] arrayRC = new ReferenciasCanceladas[1];
            Movimientos[] arrayM = new Movimientos[1];


            // Validacion
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                foreach (XmlNode Item in ItemNode.SelectSingleNode("Validacion"))
                {
                    TextBox1.Text += "\n" + Item.Name + ": " + Item.InnerText;
                }
            }

            // Estatus
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                foreach (XmlNode Item in ItemNode.SelectSingleNode("Estatus"))
                {
                    TextBox1.Text += "\n" + Item.ParentNode.Name + ": " + Item.InnerText;
                }
            }

            // Generales
            int i = 0;
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                foreach (XmlNode Item in ItemNode.SelectSingleNode("Generales"))
                {
                    Generales g = new Generales();
                    TextBox1.Text += "\n\n" + Item.Name;
                    foreach (XmlNode Item2 in Item)
                    {
                        switch (Item2.Name)
                        {
                            case "NOMBRE":
                                g.NOMBRE = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "APELLIDO":
                                g.APELLIDO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "IDENT_CLIE":
                                g.IDENT_CLIE = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "FEC_CREACION":
                                g.FEC_CREACION = Item2.InnerText.Length > 0 ? APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText) : "";
                                break;
                            case "NOM_ASOC":
                                g.NOM_ASOC = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "FEC_DEFUNCION":
                                g.FEC_DEFUNCION = Item2.InnerText.Length > 0 ? APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText) : "";
                                break;
                        }

                        if (Item2.InnerText.Length > 0)
                            TextBox1.Text += "\n\t" + Item2.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                        else
                            TextBox1.Text += "\n\t" + Item2.Name + ": ";
                    }
                    arrayG[i] = g;
                    i++;
                    Array.Resize<Generales>(ref arrayG, i);
                }
            }
            APC.GEN = arrayG;

            // Resumen
            i = 0;
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                foreach (XmlNode Item in ItemNode.SelectSingleNode("Resumen"))
                {
                    Resumen g = new Resumen();
                    TextBox1.Text += "\n\n" + Item.Name;
                    foreach (XmlNode Item2 in Item)
                    {

                        switch (Item2.Name)
                        {
                            case "RELACION":
                                g.RELACION = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "CANTIDAD":
                                g.CANTIDAD = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "MONTO":
                                g.MONTO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "SALDO_ACTUAL":
                                g.SALDO_ACTUAL = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                        }

                        TextBox1.Text += "\n\t" + Item2.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                    }
                    arrayR[i] = g;
                    i++;
                    Array.Resize<Resumen>(ref arrayR, i+1);
                }
            }
            APC.RES = arrayR;


            // Detalle
            i = 0;
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                foreach (XmlNode Item in ItemNode.SelectSingleNode("Detalle"))
                {
                    Detalle g = new Detalle();
                    TextBox1.Text += "\n\n" + Item.Name;
                    foreach (XmlNode Item2 in Item)
                    {
                        switch (Item2.Name)
                        {
                            case "NOM_ASOC":
                                g.NOM_ASOC = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "DESCR_CORTA_RELA":
                                g.DESCR_CORTA_RELA = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "FEC_INICIO_REL":
                                g.FEC_INICIO_REL = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "FEC_FIN_REL":
                                g.FEC_FIN_REL = Item2.InnerText.Length > 0 ? APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText) : "";
                                break;
                            case "MONTO_ORIGINAL":
                                g.MONTO_ORIGINAL = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "NUM_PAGOS":
                                g.NUM_PAGOS = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "DESCR_FORMA_PAGO":
                                g.DESCR_FORMA_PAGO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "IMPORTE_PAGO":
                                g.IMPORTE_PAGO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "FEC_ULTIMO_PAGO":
                                g.FEC_ULTIMO_PAGO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "MONTO_ULTIMO_PAGO":
                                g.MONTO_ULTIMO_PAGO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "DESCR_OBS_CORTA":
                                g.DESCR_OBS_CORTA = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "SALDO_ACTUAL":
                                g.SALDO_ACTUAL = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "NUM_DIAS_ATRASO":
                                g.NUM_DIAS_ATRASO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "HISTORIA":
                                g.HISTORIA = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "MONTO_CODIFICADO":
                                g.MONTO_CODIFICADO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "FEC_ACTUALIZACION":
                                g.FEC_ACTUALIZACION = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "COD_GRUPO_ECON":
                                g.COD_GRUPO_ECON = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "TIPO_ASOC":
                                g.TIPO_ASOC = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "NUM_REFER":
                                g.NUM_REFER = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                        }
                                if (Item2.InnerText.Length > 0)
                            TextBox1.Text += "\n\t" + Item2.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                        else
                            TextBox1.Text += "\n\t" + Item2.Name + ": ";
                    }
                    arrayD[i] = g;
                    i++;
                    Array.Resize<Detalle>(ref arrayD, i+1);
                }
            }
            APC.DET = arrayD;


            // ReferenciasCanceladas
            i = 0;
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                foreach (XmlNode Item in ItemNode.SelectSingleNode("ReferenciasCanceladas"))
                {
                    ReferenciasCanceladas g = new ReferenciasCanceladas();
                    TextBox1.Text += "\n\n" + Item.Name;
                    foreach (XmlNode Item2 in Item)
                    {
                        switch (Item2.Name)
                        {
                            
                            case "NOM_ASOC":
                                g.NOM_ASOC = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "DESCR_CORTA_RELA":
                                g.DESCR_CORTA_RELA = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "FEC_INICIO_REL":
                                g.FEC_INICIO_REL = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "FEC_FIN_REL":
                                g.FEC_FIN_REL = Item2.InnerText.Length > 0 ? APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText) : "";
                                break;
                            case "MONTO_ORIGINAL":
                                APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "FEC_LIQUIDACION":
                                g.FEC_LIQUIDACION = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "HISTORIA":
                                g.HISTORIA = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "DESCR_OBS_CORTA":
                                g.DESCR_OBS_CORTA = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "MONTO_CODIFICADO":
                                g.MONTO_CODIFICADO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "NUM_REFER":
                                g.NUM_REFER = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "COD_GRUPO_ECON":
                                g.COD_GRUPO_ECON = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "TIPO_ASOC":
                                g.TIPO_ASOC = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                        }
                        if (Item2.InnerText.Length > 0)
                            TextBox1.Text += "\n\t" + Item2.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                        else
                            TextBox1.Text += "\n\t" + Item2.Name + ": ";
                    }
                    arrayRC[i] = g;
                    i++;
                    Array.Resize<ReferenciasCanceladas>(ref arrayRC, i+1);
                }
            }
            APC.REF = arrayRC;


            // Movimientos
            i = 0;
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                foreach (XmlNode Item in ItemNode.SelectSingleNode("Movimientos"))
                {
                    Movimientos m = new Movimientos();
                    TextBox1.Text += "\n\n" + Item.Name;
                    foreach (XmlNode Item2 in Item)
                    {
                        switch (Item2.Name)
                        { 
                            case "NOM_ASOC":
                                m.NOM_ASOC = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
							case "FEC1":
                                m.FEC1 = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
							case "IDENT_CLIE":
                                m.IDENT_CLIE = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                        }
                        TextBox1.Text += "\n\t" + Item2.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                    }
                    arrayM[i] = m;
                    i++;
                    Array.Resize<Movimientos>(ref arrayM, i+1);
                }
            }
            APC.MOV = arrayM;


            // Score
            Score gsc = new Score();
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                foreach (XmlNode Item in ItemNode.SelectSingleNode("Score"))
                {
                    TextBox1.Text += "\n\n" + Item.Name;
                    foreach (XmlNode Item2 in Item)
                    {
                        switch (Item2.Name)
                        {
                            case "SCORE":
                                gsc.SCORE = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "PI":
                                gsc.PI = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "EXCLUSION":
                                gsc.EXCLUSION = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                        }
                        TextBox1.Text += "\n\t" + Item2.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                    }
                }
            }
            APC.SC = gsc;

            return APC;
        }
    }
}


public class APCFull
{
    public Generales[] GEN { get; set; }
    public Resumen[] RES { get; set; }
    public Detalle[] DET{ get; set; }
    public ReferenciasCanceladas[] REF { get; set; }
    public Movimientos[] MOV { get; set; }
    public Score SC { get; set; }

}

public class Generales
{
    public string NOMBRE { get; set; }
    public string APELLIDO { get; set; }
    public string IDENT_CLIE { get; set; }
    public string FEC_CREACION { get; set; }
    public string NOM_ASOC { get; set; }
    public string FEC_DEFUNCION { get; set; }
}


public class Resumen
{
    public string RELACION { get; set; }
    public string CANTIDAD { get; set; }
    public string MONTO { get; set; }
    public string SALDO_ACTUAL { get; set; }
}

public class Detalle
{
    public string NOM_ASOC { get; set; }
    public string DESCR_CORTA_RELA { get; set; }
    public string FEC_INICIO_REL { get; set; }
    public string FEC_FIN_REL { get; set; }
    public string MONTO_ORIGINAL { get; set; }
    public string NUM_PAGOS { get; set; }
    public string DESCR_FORMA_PAGO { get; set; }
    public string IMPORTE_PAGO { get; set; }
    public string FEC_ULTIMO_PAGO { get; set; }
    public string MONTO_ULTIMO_PAGO { get; set; }
    public string DESCR_OBS_CORTA { get; set; }
    public string SALDO_ACTUAL { get; set; }
    public string NUM_DIAS_ATRASO { get; set; }
    public string HISTORIA { get; set; }
    public string MONTO_CODIFICADO { get; set; }
    public string FEC_ACTUALIZACION { get; set; }
    public string COD_GRUPO_ECON { get; set; }
    public string TIPO_ASOC { get; set; }
    public string NUM_REFER { get; set; }
}

public class ReferenciasCanceladas
{
    public string NOM_ASOC { get; set; }
    public string DESCR_CORTA_RELA { get; set; }
    public string FEC_INICIO_REL { get; set; }
    public string FEC_FIN_REL { get; set; }
    public string MONTO_ORIGINAL { get; set; }
    public string FEC_LIQUIDACION { get; set; }
    public string HISTORIA { get; set; }
    public string DESCR_OBS_CORTA { get; set; }
    public string MONTO_CODIFICADO { get; set; }
    public string NUM_REFER { get; set; }
    public string COD_GRUPO_ECON { get; set; }
    public string TIPO_ASOC { get; set; }

}

public class Movimientos
{
    public string NOM_ASOC { get; set; }
    public string FEC1 { get; set; }
    public string IDENT_CLIE { get; set; }
}

public class Score
{
    public string SCORE { get; set; }
    public string PI { get; set; }
    public string EXCLUSION { get; set; }
}


//foreach (XmlNode xmlNode in xmlDoc.DocumentElement.ChildNodes[0].ChildNodes)
//{
//    foreach (XmlNode xmlNode2 in xmlNode.ChildNodes)
//    {
//        foreach (XmlNode xmlNode3 in xmlNode2.ChildNodes[0].ChildNodes)
//        {
//            // Validacion
//            if (xmlNode3.Name == "Validacion")
//            {
//                foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
//                {
//                    TextBox1.Text += "\n->> " + xmlNode4.ParentNode.Name;
//                    TextBox1.Text += "\n\t" + xmlNode4.InnerText;
//                }
//            }


//            // Estatus
//            if (xmlNode3.Name == "Estatus")
//            {
//                foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
//                {
//                    TextBox1.Text += "\n->> " + xmlNode4.ParentNode.Name;
//                    TextBox1.Text += "\n\t" + xmlNode4.InnerText;
//                }
//            }

//            // Generales
//            if (xmlNode3.Name == "Generales")
//            {
//                foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
//                {
//                    TextBox1.Text += "\n->> " + xmlNode4.Name;
//                    foreach (XmlNode xmlNode5 in xmlNode4.ChildNodes)
//                    {
//                        if (xmlNode5.InnerText.Length > 0)
//                            TextBox1.Text += "\n\t" + xmlNode5.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(xmlNode5.InnerText);
//                        else
//                            TextBox1.Text += "\n\t" + xmlNode5.Name + ": ";
//                    }
//                }
//            }

//            // Resumen
//            if (xmlNode3.Name == "Resumen")
//            {
//                foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
//                {
//                    TextBox1.Text += "\n->> " + xmlNode4.Name;
//                    foreach (XmlNode xmlNode5 in xmlNode4.ChildNodes)
//                    {
//                        if (xmlNode5.InnerText.Length > 0)
//                            TextBox1.Text += "\n\t" + xmlNode5.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(xmlNode5.InnerText);
//                        else
//                            TextBox1.Text += "\n\t" + xmlNode5.Name + ": ";
//                    }
//                }
//            }

//            // Detalle
//            if (xmlNode3.Name == "Detalle")
//            {
//                foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
//                {
//                    TextBox1.Text += "\n->> " + xmlNode4.Name;
//                    foreach (XmlNode xmlNode5 in xmlNode4.ChildNodes)
//                    {
//                        if (xmlNode5.InnerText.Length > 0)
//                            TextBox1.Text += "\n\t" + xmlNode5.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(xmlNode5.InnerText);
//                        else
//                            TextBox1.Text += "\n\t" + xmlNode5.Name + ": ";
//                    }
//                }
//            }

//            // ReferenciasCanceladas
//            if (xmlNode3.Name == "ReferenciasCanceladas")
//            {
//                foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
//                {
//                    TextBox1.Text += "\n->> " + xmlNode4.Name;
//                    foreach (XmlNode xmlNode5 in xmlNode4.ChildNodes)
//                    {
//                        if (xmlNode5.InnerText.Length > 0)
//                            TextBox1.Text += "\n\t" + xmlNode5.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(xmlNode5.InnerText);
//                        else
//                            TextBox1.Text += "\n\t" + xmlNode5.Name + ": ";
//                    }
//                }
//            }

//            // Movimientos
//            if (xmlNode3.Name == "Movimientos")
//            {
//                foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
//                {
//                    TextBox1.Text += "\n->> " + xmlNode4.Name;
//                    foreach (XmlNode xmlNode5 in xmlNode4.ChildNodes)
//                    {
//                        if (xmlNode5.InnerText.Length > 0)
//                            TextBox1.Text += "\n\t" + xmlNode5.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(xmlNode5.InnerText);
//                        else
//                            TextBox1.Text += "\n\t" + xmlNode5.Name + ": ";
//                    }
//                }
//            }

//            // Score
//            if (xmlNode3.Name == "Score")
//            {
//                foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
//                {
//                    TextBox1.Text += "\n->> " + xmlNode4.Name;
//                    foreach (XmlNode xmlNode5 in xmlNode4.ChildNodes)
//                    {
//                        if (xmlNode5.InnerText.Length > 0)
//                            TextBox1.Text += "\n\t" + xmlNode5.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(xmlNode5.InnerText);
//                        else
//                            TextBox1.Text += "\n\t" + xmlNode5.Name + ": ";
//                    }
//                }
//            }
//        }
//    }

//}




//[XmlRoot(ElementName = "Lista")]
//public class Lista
//{
//    [XmlElement(ElementName = "elemento")]
//    public List<Dato> Elemento { get; set; }
//}

//[XmlRoot(ElementName = "Dato")]
//public class Dato
//{
//    [XmlElement(ElementName = "nombre")]
//    public string Nombre { get; set; }
//    [XmlElement(ElementName = "nota")]
//    public string Nota { get; set; }
//}




//[XmlRoot(ElementName = "Resultado")]
//public class MiAPC
//{
//    [XmlElement(ElementName = "EsValido")]
//    public string EsValido { get; set; }

//    [XmlElement(ElementName = "Estatus")]
//    public string Estatus { get; set; }

//    [XmlElement(ElementName = "Generales")]
//    public Generales Generales { get; set; }

//    [XmlElement(ElementName = "Score")]
//    public Score Score { get; set; }
//}

//[XmlRoot(ElementName = "Generales")]
//public class Generales
//{
//    [XmlElement(ElementName = "NOMBRE")]
//    public string NOMBRE { get; set; }

//    [XmlElement(ElementName = "APELLIDO")]
//    public string APELLIDO { get; set; }

//    [XmlElement(ElementName = "IDENT_CLIE")]
//    public string IDENT_CLIE { get; set; }

//    [XmlElement(ElementName = "FEC_CREACION")]
//    public string FEC_CREACION { get; set; }

//    [XmlElement(ElementName = "NOM_ASOC")]
//    public string NOM_ASOC { get; set; }

//    [XmlElement(ElementName = "FEC_DEFUNCION")]
//    public string FEC_DEFUNCION { get; set; }

//}

//[XmlRoot(ElementName = "Score")]
//public class Score
//{
//    [XmlElement(ElementName = "SCORE")]
//    public string SCORE { get; set; }

//    [XmlElement(ElementName = "PI")]
//    public string PI { get; set; }

//    [XmlElement(ElementName = "EXCLUSION")]
//    public string EXCLUSION { get; set; }
//}
