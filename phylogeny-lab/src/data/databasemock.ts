import { FaVirusCovid } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import { GiSeatedMouse } from "react-icons/gi";
import { FaBacteria } from "react-icons/fa";
import { PiDnaLight } from "react-icons/pi";
import { FaDatabase } from "react-icons/fa";

const columns = [
  {name: "ACCESSION", uid: "accession", sortable: true},
  {name: "ORGANISM_NAME", uid: "organism_name", sortable: true},
  {name: "STATUS", uid: "status", sortable: true},
  {name: "TOTAL_SEQUENCE_LENGTH", uid: "total_sequence_length", sortable: true},
  {name: "RELEASE_DATE", uid: "release_date", sortable: true},
  {name: "ASSEMBLY_NAME", uid: "assembly_name", sortable: true},
  {name: "ASSEMBLY_TYPE", uid: "assembly_type", sortable: true},
  {name: "GC_COUNT", uid: "gc_count", sortable: true},
  {name: "GC_PERCENT", uid: "gc_percent", sortable: true},
  {name: "CHROMOSOMES", uid: "total_number_of_chromosomes", sortable: true},
  {name: "TAX_ID", uid: "tax_id", sortable: true},
  {name: "SOURCE_DATABASE", uid: "source_database", sortable: true},
  {name: "ACCESSION_NAME", uid: "accession_name", sortable: true},
  {name: "TOTAL_GENES", uid: "total_genes", sortable: true},
  {name: "", uid: "more_info", sortable: true},
];

const statusOptions = [
  {name: "Installed", uid: "installed"},
  {name: "Available", uid: "available"},
  {name: "Installing", uid: "installing"}
];

const speciesIconMap: any = {
  'panthera leo': 'http://localhost:3000/assets/animals/panthera_leo.svg',
  "canis lupus familiaris": 'http://localhost:3000/assets/animals/canis_lupus_familiaris.svg',
  "canis lupus dingo": 'http://localhost:3000/assets/animals/canis_lupus_dingo.svg',
  "felis catus": "http://localhost:3000/assets/animals/felis_catus.svg",
  "equus caballus": "http://localhost:3000/assets/animals/equus_caballus.svg",
  "equus asinus": "http://localhost:3000/assets/animals/donkey.svg",
  "homo sapiens": "http://localhost:3000/assets/animals/homo_sapiens.svg",
  "calypte anna": "http://localhost:3000/assets/animals/calypte_anna.svg",
  "anas platyrhynchos": "http://localhost:3000/assets/animals/anas_platyrhynchos.svg",
  "bos taurus": "http://localhost:3000/assets/animals/bos_taurus.svg"
}

const genusIconMap: any = {
  'mus': 'http://localhost:3000/assets/animals/mus.svg',
  'rattus': 'http://localhost:3000/assets/animals/rattus.svg',
  'camelus': 'http://localhost:3000/assets/animals/camelus.svg',
  "ref_euk_rep_genomes": PiDnaLight,
  "nt_prok": FaBacteria,
  'eumetopias': "http://localhost:3000/assets/animals/sea_lion.svg",
  "zalophus": "http://localhost:3000/assets/animals/sea_lion.svg",
  "giraffa": "http://localhost:3000/assets/animals/giraffa.svg",
  "gallus": "http://localhost:3000/assets/animals/gallus.svg",
  "odobenus": "http://localhost:3000/assets/animals/odobenus.svg",
  "loxodonta": "http://localhost:3000/assets/animals/loxodonta.svg",
  "orycteropus": "http://localhost:3000/assets/animals/orycteropus.svg",
  "dasypus": "http://localhost:3000/assets/animals/dasypus.svg",
  "oryctolagus": "http://localhost:3000/assets/animals/oryctolagus.svg",
  "hippopotamus": "http://localhost:3000/assets/animals/oryctolagus.svg",
  "aptenodytes": "http://localhost:3000/assets/animals/aptenodytes.svg",
  "pan": "http://localhost:3000/assets/animals/pan.svg",
  "engystomops": "http://localhost:3000/assets/animals/engystomops.svg",
  "hyla": "http://localhost:3000/assets/animals/hyla.svg",
  "hymenochirus": "http://localhost:3000/assets/animals/hymenochirus.svg",
  "pseudophryne": "http://localhost:3000/assets/animals/pseudophryne.svg",
  "rana": "http://localhost:3000/assets/animals/rana.svg",
  "xenopus": "http://localhost:3000/assets/animals/xenopus.svg",
  "vulpes": "http://localhost:3000/assets/animals/vulpes.svg",
  "crocodylus": "http://localhost:3000/assets/animals/crocodylus.svg",
  "alligator": "http://localhost:3000/assets/animals/alligator.svg",
  "orcinus": "http://localhost:3000/assets/animals/orcinus.svg",
  "macaca": "http://localhost:3000/assets/animals/macaca.svg",
  "canis_lupus": "http://localhost:3000/assets/animals/canis_lupus.svg",
  "ophiophagus": "http://localhost:3000/assets/animals/ophiophagus.svg",
  "naja": "http://localhost:3000/assets/animals/naja.svg",
  "xiphias": "http://localhost:3000/assets/animals/xiphias.svg",
  "delphinus": "http://localhost:3000/assets/animals/delphinus.svg",
  "probosciger": "http://localhost:3000/assets/animals/probosciger.svg",
  "corvus": "http://localhost:3000/assets/animals/corvus.svg",
  "ceyx": "http://localhost:3000/assets/animals/kingfisher.svg",
  "chloroceryle": "http://localhost:3000/assets/animals/kingfisher.svg",
  "dromaius": "http://localhost:3000/assets/animals/dromaius.svg",
  "struthio": "http://localhost:3000/assets/animals/struthio.svg",
  "centruroides": "http://localhost:3000/assets/animals/scorpion_small.svg",
  "acanthopagrus": "http://localhost:3000/assets/animals/acanthopagrus.svg",
  "cyprinus": "http://localhost:3000/assets/animals/cyprinus.svg",
  "columba": "http://localhost:3000/assets/animals/columba.svg",
  "acromyrmex": "http://localhost:3000/assets/animals/ant.svg",
  "acinonyx": "http://localhost:3000/assets/animals/acinonyx.svg",
  "bambusicola": "http://localhost:3000/assets/animals/bambusicola.svg",
  "danaus": "http://localhost:3000/assets/animals/butterfly.svg",
  "pararge": "http://localhost:3000/assets/animals/butterfly.svg",
  "zerene": "http://localhost:3000/assets/animals/butterfly.svg",
  "carcharodon": "http://localhost:3000/assets/animals/carcharodon.svg",
}

export {columns, statusOptions, genusIconMap, speciesIconMap};