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
                UsingXMLDocument();
            }
        }

        protected void UsingXMLDocument()
        {

            string usuarioconsulta = APCEncrypt.ScorePlusEncrypt.EncryptString("uprueba001");
            string claveConsulta = APCEncrypt.ScorePlusEncrypt.EncryptString("password01*");
            string IdentCliente = APCEncrypt.ScorePlusEncrypt.EncryptString("0-509-1938");
            string TipoCliente = APCEncrypt.ScorePlusEncrypt.EncryptString("1");
            string Producto = APCEncrypt.ScorePlusEncrypt.EncryptString("1");


            ServiceReferenceAPC.apcscoreSoapClient ws = new ServiceReferenceAPC.apcscoreSoapClient();
            string ServiceResult = ws.ApcScore(usuarioconsulta, claveConsulta, IdentCliente, TipoCliente, Producto);


            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.LoadXml(ServiceResult);
   
            foreach (XmlNode xmlNode in xmlDoc.DocumentElement.ChildNodes[0].ChildNodes)
            {
                foreach (XmlNode xmlNode2 in xmlNode.ChildNodes)
                {
                    foreach (XmlNode xmlNode3 in xmlNode2.ChildNodes[0].ChildNodes)
                    {

                        // Validacion
                        if (xmlNode3.Name == "Validacion")
                        {
                            foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
                            {
                                TextBox1.Text += "\n->> " + xmlNode4.Name;
                                foreach (XmlNode xmlNode5 in xmlNode4.ChildNodes)
                                {
                                    if (xmlNode5.InnerText.Length > 0)
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": " + xmlNode5.InnerText;
                                    else
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": ";
                                }
                            }
                        }


                        // Estatus
                        if (xmlNode3.Name == "Estatus")
                        {
                            foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
                            {
                                TextBox1.Text += "\n->> " + xmlNode4.Name;
                                foreach (XmlNode xmlNode5 in xmlNode4.ChildNodes)
                                {
                                    if (xmlNode5.InnerText.Length > 0)
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": " + xmlNode5.InnerText;
                                    else
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": ";
                                }
                            }
                        }

                        // Generales
                        if (xmlNode3.Name == "Generales")
                        {
                            foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
                            {
                                TextBox1.Text += "\n->> " + xmlNode4.Name;
                                foreach (XmlNode xmlNode5 in xmlNode4.ChildNodes)
                                {
                                    if (xmlNode5.InnerText.Length > 0)
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(xmlNode5.InnerText);
                                    else
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": ";
                                }
                            }
                        }

                        // Resumen
                        if (xmlNode3.Name == "Resumen")
                        {
                            foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
                            {
                                TextBox1.Text += "\n->> " + xmlNode4.Name;
                                foreach (XmlNode xmlNode5 in xmlNode4.ChildNodes)
                                {
                                    if (xmlNode5.InnerText.Length > 0)
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(xmlNode5.InnerText);
                                    else
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": ";
                                }
                            }
                        }

                        // Detalle
                        if (xmlNode3.Name == "Detalle")
                        {
                            foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
                            {
                                TextBox1.Text += "\n->> " + xmlNode4.Name;
                                foreach (XmlNode xmlNode5 in xmlNode4.ChildNodes)
                                {
                                    if (xmlNode5.InnerText.Length > 0)
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(xmlNode5.InnerText);
                                    else
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": ";
                                }
                            }
                        }

                        // ReferenciasCanceladas
                        if (xmlNode3.Name == "ReferenciasCanceladas")
                        {
                            foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
                            {
                                TextBox1.Text += "\n->> " + xmlNode4.Name;
                                foreach (XmlNode xmlNode5 in xmlNode4.ChildNodes)
                                {
                                    if(xmlNode5.InnerText.Length > 0)
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(xmlNode5.InnerText);
                                    else
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": ";
                                }
                            }
                        }

                        // Movimientos
                        if (xmlNode3.Name == "Movimientos")
                        {
                            foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
                            {
                                TextBox1.Text += "\n->> " + xmlNode4.Name;
                                foreach (XmlNode xmlNode5 in xmlNode4.ChildNodes)
                                {
                                    if (xmlNode5.InnerText.Length > 0)
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(xmlNode5.InnerText);
                                    else
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": ";
                                }
                            }
                        }

                        // Score
                        if (xmlNode3.Name == "Score")
                        {
                            foreach (XmlNode xmlNode4 in xmlNode3.ChildNodes)
                            {
                                TextBox1.Text += "\n->> " + xmlNode4.Name;
                                foreach (XmlNode xmlNode5 in xmlNode4.ChildNodes)
                                {
                                    if (xmlNode5.InnerText.Length > 0)
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(xmlNode5.InnerText);
                                    else
                                        TextBox1.Text += "\n" + xmlNode5.Name + ": ";
                                }
                            }
                        }
                    }
                }
                
            }

            

            //XmlNodeList ItemNodes = xmlDoc.SelectNodes("//Resultado");
            
            //// Validacion
            //foreach (XmlNode ItemNode in ItemNodes)
            //{
            //    //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
            //    foreach (XmlNode Item in ItemNode.SelectSingleNode("Validacion"))
            //    {
            //        TextBox1.Text += "\n" + Item.Name + ": " + Item.InnerText;
            //    }
            //}

            //// Estatus
            //foreach (XmlNode ItemNode in ItemNodes)
            //{
            //    //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
            //    foreach (XmlNode Item in ItemNode.SelectSingleNode("Estatus"))
            //    {
            //        TextBox1.Text += "\n" + Item.ParentNode.Name + ": " + Item.InnerText;
            //    }
            //}

            //// Generales
            //foreach (XmlNode ItemNode in ItemNodes)
            //{
            //    //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
            //    foreach (XmlNode Item in ItemNode.SelectSingleNode("Generales"))
            //    {
            //        TextBox1.Text += "\n\n" + Item.Name;
            //        foreach (XmlNode Item2 in Item)
            //        {
            //            if (Item2.InnerText.Length > 0)
            //                TextBox1.Text += "\n" + Item2.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
            //            else
            //                TextBox1.Text += "\n" + Item2.Name + ": ";
            //        }
            //    }
            //}

            //// Resumen
            //foreach (XmlNode ItemNode in ItemNodes)
            //{
            //    //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
            //    foreach (XmlNode Item in ItemNode.SelectSingleNode("Resumen"))
            //    {
            //        TextBox1.Text += "\n\n" + Item.Name;
            //        foreach (XmlNode Item2 in Item)
            //        {
            //            TextBox1.Text += "\n" + Item2.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
            //        }
            //    }
            //}

            //// Score
            //foreach (XmlNode ItemNode in ItemNodes)
            //{
            //    //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
            //    foreach (XmlNode Item in ItemNode.SelectSingleNode("Score"))
            //    {
            //        TextBox1.Text += "\n\n" + Item.Name;
            //        foreach (XmlNode Item2 in Item)
            //        {
            //            TextBox1.Text += "\n" + Item2.Name + ": " + APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
            //        }
            //    }
            //}

        }
    }
}

public class Generales
{
    public string NOMBRE { get; set; }
    public string APELLIDO { get; set; }
    public string IDENT_CLIE { get; set; }
    public string FEC_CREACION { get; set; }
    public string NOM_ASOC { get; set; }
    public string FEC_DEFUNCION { get; set; }
    public string SCORE { get; set; }
    public string PI { get; set; }
    public string EXCLUSION { get; set; }
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
    public string SALDO_FEC_ULTIMO_PAGOACTUAL { get; set; }
    public string MONTO_ULTIMO_PAGO { get; set; }
    public string DESCR_OBS_CORTA { get; set; }
    public string SALDO_CTUAL { get; set; }
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
