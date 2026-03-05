import React, { useState, useEffect } from "react";

/* ─── PALETTE ───────────────────────────────────────────────── */
const C = {
  bg:      "#1C1E2A",
  surface: "#252837",
  border:  "rgba(255,255,255,0.08)",
  text:    "#E8EAF0",
  muted:   "rgba(232,234,240,0.4)",
  faint:   "rgba(232,234,240,0.10)",
  blue:    "#5B7FFF",
  gold:    "#D4A843",
  green:   "#3EC98A",
  red:     "#F06070",
  purple:  "#9B6FE0",
  orange:  "#F07840",
  teal:    "#2EC4B6",
  pink:    "#FF6B9D",
};

/* ─── CARDS GUIDE DATA ──────────────────────────────────────── */
/* ─── REFERRAL LINKS (fictifs pour la démo) ─────────────────── */
const REFERRALS = {
  revolut: { url:"https://revolut.com/referral/TONCODE", bonus:"3 mois Premium offerts", label:"S'inscrire via mon lien" },
  amex:    { url:"https://amex.com/referral/TONCODE",    bonus:"15 000 pts offerts (valeur ~270€)", label:"Demander la carte via mon lien" },
};

const REVOLUT_PLANS = [
  {
    name:"Standard", price:0, color:"#888", badge:"Gratuit", ideal:"Découverte",
    points:"1 pt / 4€", accrual:"×0,25",
    avantages:["Paiements sans frais à l'étranger (plafond mensuel)","Retraits gratuits jusqu'à 200€/mois","Carte virtuelle & physique","Taux de change interbancaire en semaine"],
    limites:["Pas d'accès au Shops boost","Pas d'assurance voyage","Pas de transfert de points vers miles"],
    who:"Pour tester Revolut sans engagement.",
    details:{
      abonnements: null,
      bienvenue: null,
      assurance: "Aucune assurance voyage incluse.",
    }
  },
  {
    name:"Plus", price:3.99, color:"#5B8FFF", badge:"3,99€/mois", ideal:"Débutant",
    points:"1 pt / 4€", accrual:"×0,25",
    avantages:["Tout le Standard +","Support client prioritaire","Protection des achats","Retraits gratuits jusqu'à 200€/mois"],
    limites:["Toujours pas d'accès Shops boost","Pas d'assurance voyage complète","Pas de transfert vers miles"],
    who:"Peu d'avantages miles — à éviter pour l'optimisation.",
    details:{
      abonnements: null,
      bienvenue: null,
      assurance: "Protection des achats uniquement (remboursement si article endommagé ou volé sous 90 jours).",
    }
  },
  {
    name:"Premium", price:9.99, color:"#5B7FFF", badge:"9,99€/mois", ideal:"Voyageur occasionnel", hot:true,
    points:"1 pt / 2€", accrual:"×0,5",
    avantages:["Accès au Shops Revolut (boosts ×4 à ×12)","Transfert RevPoints vers 30+ compagnies aériennes","Retraits gratuits jusqu'à 400€/mois","Assurance voyage incluse","Paiements en devises illimités","Accès salons d'aéroport (payant, ~25€/visite)"],
    limites:["Accès salons payant (pas illimité)","Aucune condition de revenus requise"],
    who:"Le meilleur rapport qualité/prix pour commencer à optimiser ses miles.",
    details:{
      abonnements: null,
      bienvenue:"3 mois offerts via lien de parrainage (valeur ~30€). Pas de bonus en points.",
      assurance:"Assurance voyage complète : annulation de voyage, assistance médicale à l'étranger, retard de bagage, perte de documents. Valable pour toi + 1 accompagnant.",
    }
  },
  {
    name:"Metal", price:16.99, color:"#A0A0B0", badge:"16,99€/mois", ideal:"Voyageur fréquent",
    points:"1 pt / 2€", accrual:"×0,5",
    avantages:["Tout le Premium +","Carte en métal physique","Retraits gratuits jusqu'à 800€/mois","Cashback sur dépenses internationales","Abonnements partenaires inclus (~2 600€/an)","Assurances renforcées (véhicule, RC)"],
    limites:["Points identiques au Premium","84€/an de plus que Premium"],
    who:"Intéressant uniquement si tu exploites les abonnements inclus.",
    details:{
      abonnements:"Inclus avec Metal : Freeletics (180€/an), WeWork Day Pass (2 jours/mois), GetYourGuide (10% de remise), Headspace (70€/an). Total estimé ~2 600€ si tout utilisé.",
      bienvenue:"3 mois offerts via lien de parrainage. Pas de bonus en points.",
      assurance:"Tout le Premium + assurance location de voiture (CDW), assurance responsabilité civile à l'étranger.",
    }
  },
  {
    name:"Ultra", price:45, color:"#D4A843", badge:"45€/mois", ideal:"Voyageur premium",
    points:"1 pt / 2€", accrual:"×0,5",
    avantages:["Tout le Metal +","Carte plaquée platine","Retraits gratuits jusqu'à 2 000€/mois","Accès illimité aux salons d'aéroport","Virements internationaux gratuits","eSIM 3Go/mois incluse","Abonnements inclus (~4 480€/an)","Concierge personnel"],
    limites:["45€/mois = 540€/an — à bien rentabiliser","Même accrual points que Premium/Metal"],
    who:"Uniquement si tu voyages très fréquemment et exploites les salons aéroport.",
    details:{
      abonnements:"Tout Metal + accès salons LoungeKey illimité (valeur ~500€/an), eSIM 3Go dans 100+ pays, Deliveroo Plus gratuit, NordVPN, et plusieurs autres. Total estimé ~4 480€/an.",
      bienvenue:"3 mois offerts via lien de parrainage. Pas de bonus en points.",
      assurance:"Couverture la plus complète : tout Metal + assurance gadgets et appareils électroniques (jusqu'à 1 500€), annulation événements, protection identité.",
    }
  },
];

const AMEX_PLANS = [
  {
    name:"Green", price:7.50, color:"#4CAF7D", badge:"7,50€/mois", ideal:"Débutant Amex",
    points:"1 pt / 1€", accrual:"×1",
    avantages:["1 point Membership Rewards par euro dépensé","Points sans expiration","Transfert vers Flying Blue, Avios, Emirates, ANA...","Débit différé (paiement fin de mois)","Protection des achats"],
    limites:["Pas d'assurance voyage","Pas d'accès aux salons","Moins acceptée que Visa/Mastercard"],
    who:"Bonne entrée pour accumuler des Membership Rewards sans se ruiner.",
    details:{
      abonnements: null,
      bienvenue:"Pas de bonus de bienvenue significatif sur la Green actuellement.",
      assurance:"Protection des achats uniquement : remboursement si article acheté avec la carte est volé ou endommagé dans les 90 jours suivant l'achat.",
    }
  },
  {
    name:"Gold", price:16, color:"#D4A843", badge:"16€/mois (gratuite 1ère année)", ideal:"Voyageur régulier", hot:true,
    points:"1 pt / 1€", accrual:"×1",
    avantages:["1 point Membership Rewards par euro","Transfert 1:1 vers 20+ programmes (Flying Blue, Avios, Emirates, ANA...)","Assurance voyage complète incluse","Assurance achat & protection","Carte GRATUITE la 1ère année","Débit différé jusqu'à 30 jours","Cartes supplémentaires gratuites pour proches"],
    limites:["16€/mois dès la 2ème année","Acceptation limitée (~70% des commerces en France)","Pas de lounge gratuit illimité"],
    who:"Le meilleur choix pour maximiser les transferts vers les 5 programmes de l'app. À combiner avec Revolut Premium.",
    details:{
      abonnements: null,
      bienvenue:"En passant par un lien de parrainage, tu peux recevoir jusqu'à 15 000 points Membership Rewards offerts après avoir atteint un seuil de dépenses (souvent 3 000€ dans les 3 premiers mois). Valeur estimée : ~270€ en miles Business.",
      assurance:"Assurance voyage complète : annulation de voyage (jusqu'à 5 000€), retard de vol ou bagage, perte de bagages (jusqu'à 1 250€), assistance médicale urgente à l'étranger. Valable pour toi + conjoint + enfants si le voyage est payé avec la carte.",
    }
  },
  {
    name:"Platinum", price:59, color:"#A0A0B0", badge:"59€/mois", ideal:"Grand voyageur",
    points:"1 pt / 1€", accrual:"×1",
    avantages:["Tout Gold +","Accès illimité à 1 700 salons dans le monde (Priority Pass)","200€ crédit dining restaurants partenaires/an","Abonnement streaming remboursé (~120€/an)","Amazon Prime remboursé (6,99€/mois)","Fine Hotels & Resorts (surclassements & petit-déj inclus)","Conciergerie 7j/7","1 carte Platinum + 4 cartes Gold supplémentaires gratuites"],
    limites:["708€/an — à bien rentabiliser","Même accrual points que Gold"],
    who:"Uniquement si tu voyages souvent et exploites vraiment les salons et crédits inclus.",
    details:{
      abonnements:"200€ crédit dining/an (restaurants partenaires Amex), Amazon Prime (~84€/an), abonnement streaming au choix (~120€/an), Disney+ ou équivalent. Si tout utilisé : ~400€ d'avantages annuels.",
      bienvenue:"Bonus de bienvenue pouvant atteindre 400€ en valeur : généralement 40 000 points Membership Rewards offerts après 4 000€ de dépenses dans les 3 premiers mois. Ces points valent ~400€ en vols Business. Conditions variables selon l'offre du moment.",
      assurance:"La plus complète du marché : tout Gold + assurance annulation jusqu'à 10 000€, couverture médicale d'urgence illimitée à l'étranger, assurance location de voiture (CDW), retard vol dès 4h (100€/jour), perte objets personnels.",
    }
  },
];

/* ─── PROGRAMMES ────────────────────────────────────────────── */
const PROGRAMS = [
  { id:"fb",       name:"Flying Blue",    abbr:"FB",  color:"#3A8FF5", logo:"🔵", desc:"Air France / KLM",       transferFrom:["revolut","amex"] },
  { id:"avios",    name:"Avios",          abbr:"AV",  color:C.purple,  logo:"🟣", desc:"British Airways / Iberia",transferFrom:["revolut","amex"] },
  { id:"emirates", name:"Emirates",       abbr:"EK",  color:C.red,     logo:"🔴", desc:"Skywards",               transferFrom:["revolut","amex"] },
  { id:"krisflyer",name:"KrisFlyer",      abbr:"SQ",  color:C.gold,    logo:"🟡", desc:"Singapore Airlines",     transferFrom:["revolut","amex"] },
  { id:"ana",      name:"ANA",            abbr:"NH",  color:C.teal,    logo:"🩵", desc:"All Nippon Airways",     transferFrom:["amex"] },
];

/* ─── CARDS ─────────────────────────────────────────────────── */
const CARDS_INIT = [
  { id:"revolut", name:"Revolut Premium", points:12400, program:"RevPoints",          monthly:9.99,  accrual:2, color:C.blue },
  { id:"amex",    name:"Amex Gold",        points:8750,  program:"Membership Rewards", monthly:15,    accrual:1, color:C.gold },
  { id:"fb",      name:"Flying Blue",      points:6200,  program:"Miles",              monthly:0,     accrual:0, color:"#3A8FF5" },
];

/* ─── BOOSTS ─────────────────────────────────────────────────── */
const BOOSTS = [
  { brand:"Amazon",    cat:"E-commerce",  card:"revolut", multi:"×8",  logo:"📦", color:C.orange, tip:"Via le portail Shops Revolut" },
  { brand:"Zalando",   cat:"E-commerce",  card:"revolut", multi:"×10", logo:"👟", color:C.blue,   tip:"Mode & chaussures" },
  { brand:"Fnac",      cat:"E-commerce",  card:"revolut", multi:"×6",  logo:"📚", color:C.gold,   tip:"Tech, livres, culture" },
  { brand:"Cdiscount", cat:"E-commerce",  card:"revolut", multi:"×5",  logo:"🛒", color:C.red,    tip:"High-tech & électroménager" },
  { brand:"eBay",      cat:"E-commerce",  card:"revolut", multi:"×4",  logo:"🏷️", color:C.green,  tip:"Achat & revente" },
  { brand:"Airbnb",    cat:"Voyage",      card:"revolut", multi:"×5",  logo:"🏠", color:C.red,    tip:"Hébergements insolites" },
  { brand:"Booking",   cat:"Voyage",      card:"revolut", multi:"×4",  logo:"🏨", color:C.blue,   tip:"Hôtels & apparts" },
  { brand:"Expedia",   cat:"Voyage",      card:"amex",    multi:"×3",  logo:"✈️", color:C.purple, tip:"Vols + hôtels combinés" },
  { brand:"Rentalcars",cat:"Voyage",      card:"revolut", multi:"×5",  logo:"🚗", color:C.orange, tip:"Location de voiture" },
  { brand:"Nike",      cat:"Sport & Mode",card:"revolut", multi:"×12", logo:"👟", color:C.orange, tip:"Meilleur boost du moment !" },
  { brand:"Adidas",    cat:"Sport & Mode",card:"revolut", multi:"×8",  logo:"⚽", color:C.text,   tip:"Sport & streetwear" },
  { brand:"Decathlon", cat:"Sport & Mode",card:"revolut", multi:"×5",  logo:"🏃", color:C.blue,   tip:"Tous les sports" },
  { brand:"ASOS",      cat:"Sport & Mode",card:"revolut", multi:"×7",  logo:"👗", color:C.purple, tip:"Mode en ligne" },
  { brand:"Uber Eats", cat:"Livraison",   card:"revolut", multi:"×4",  logo:"🍔", color:C.green,  tip:"Livraison à domicile" },
  { brand:"Deliveroo", cat:"Livraison",   card:"revolut", multi:"×4",  logo:"🛵", color:C.blue,   tip:"Restaurants du quartier" },
  { brand:"The Fork",  cat:"Livraison",   card:"amex",    multi:"×2",  logo:"🍽️", color:C.gold,   tip:"Réservation + cashback" },
  { brand:"Starbucks", cat:"Livraison",   card:"amex",    multi:"×2",  logo:"☕", color:C.green,  tip:"Cafés & snacks" },
  { brand:"Apple",     cat:"High-tech",   card:"amex",    multi:"×2",  logo:"🍎", color:C.text,   tip:"App Store, iTunes, hardware" },
  { brand:"Spotify",   cat:"High-tech",   card:"revolut", multi:"×3",  logo:"🎵", color:C.green,  tip:"Abonnement mensuel" },
  { brand:"Netflix",   cat:"High-tech",   card:"revolut", multi:"×3",  logo:"🎬", color:C.red,    tip:"Streaming vidéo" },
  { brand:"Microsoft", cat:"High-tech",   card:"amex",    multi:"×2",  logo:"💻", color:C.blue,   tip:"Microsoft 365, Azure" },
];

const CATS = ["Toutes","E-commerce","Voyage","Sport & Mode","Livraison","High-tech"];

/* ─── DESTINATIONS MULTI-PROGRAMME ──────────────────────────── */
// Each destination has offers per programme (miles needed, retail price, transfer ratio from RevPoints/Amex MR)
const DESTINATIONS = [
  {
    dest:"New York", region:"Amérique du Nord", icon:"🗽",
    offers:[
      { prog:"fb",        classe:"Éco",      miles:18750, retail:650,  available:true  },
      { prog:"avios",     classe:"Éco",      miles:26000, retail:650,  available:true  },
      { prog:"avios",     classe:"Business", miles:50000, retail:3200, available:true  },
      { prog:"fb",        classe:"Business", miles:55000, retail:3200, available:true  },
      { prog:"emirates",  classe:"Business", miles:62500, retail:3400, available:false },
      { prog:"krisflyer", classe:"Éco",      miles:35000, retail:650,  available:false },
    ]
  },
  {
    dest:"Tokyo", region:"Asie", icon:"🗼",
    offers:[
      { prog:"ana",       classe:"Éco",      miles:35000, retail:1200, available:true  },
      { prog:"ana",       classe:"Business", miles:55000, retail:5500, available:true  },
      { prog:"krisflyer", classe:"Éco",      miles:42500, retail:1200, available:true  },
      { prog:"krisflyer", classe:"Business", miles:67500, retail:5500, available:false },
      { prog:"fb",        classe:"Éco",      miles:40000, retail:1200, available:false },
      { prog:"fb",        classe:"Business", miles:80000, retail:5500, available:false },
      { prog:"avios",     classe:"Éco",      miles:40000, retail:1200, available:false },
    ]
  },
  {
    dest:"Dubaï", region:"Moyen-Orient", icon:"🏙️",
    offers:[
      { prog:"emirates",  classe:"Éco",      miles:22500, retail:680,  available:true  },
      { prog:"emirates",  classe:"Business", miles:57500, retail:4500, available:true  },
      { prog:"emirates",  classe:"First",    miles:85000, retail:8000, available:false },
      { prog:"fb",        classe:"Éco",      miles:22500, retail:680,  available:true  },
      { prog:"avios",     classe:"Éco",      miles:22500, retail:680,  available:false },
    ]
  },
  {
    dest:"Singapour", region:"Asie", icon:"🦁",
    offers:[
      { prog:"krisflyer", classe:"Éco",      miles:37500, retail:890,  available:true  },
      { prog:"krisflyer", classe:"Business", miles:67500, retail:6500, available:false },
      { prog:"ana",       classe:"Éco",      miles:43000, retail:890,  available:false },
      { prog:"fb",        classe:"Éco",      miles:22500, retail:890,  available:true  },
    ]
  },
  {
    dest:"Bangkok", region:"Asie", icon:"🛕",
    offers:[
      { prog:"ana",       classe:"Éco",      miles:40000, retail:750,  available:false },
      { prog:"krisflyer", classe:"Éco",      miles:35000, retail:750,  available:true  },
      { prog:"fb",        classe:"Éco",      miles:22500, retail:750,  available:true  },
      { prog:"avios",     classe:"Éco",      miles:35000, retail:750,  available:false },
    ]
  },
  {
    dest:"Los Angeles", region:"Amérique du Nord", icon:"🎬",
    offers:[
      { prog:"avios",     classe:"Éco",      miles:28000, retail:720,  available:true  },
      { prog:"fb",        classe:"Éco",      miles:22500, retail:720,  available:true  },
      { prog:"ana",       classe:"Éco",      miles:52500, retail:720,  available:false },
      { prog:"krisflyer", classe:"Éco",      miles:35000, retail:720,  available:false },
    ]
  },
  {
    dest:"Miami", region:"Amérique du Nord", icon:"🌴",
    offers:[
      { prog:"fb",        classe:"Éco",      miles:22500, retail:680,  available:true  },
      { prog:"avios",     classe:"Premium Éco",miles:30000,retail:980,  available:true  },
      { prog:"emirates",  classe:"Éco",      miles:37500, retail:680,  available:false },
    ]
  },
  {
    dest:"Maurice", region:"Afrique", icon:"🏝️",
    offers:[
      { prog:"emirates",  classe:"Éco",      miles:28500, retail:820,  available:false },
      { prog:"fb",        classe:"Éco",      miles:22500, retail:820,  available:true  },
      { prog:"avios",     classe:"Éco",      miles:30000, retail:820,  available:false },
    ]
  },
  {
    dest:"Bali", region:"Asie", icon:"🌺",
    offers:[
      { prog:"krisflyer", classe:"Éco",      miles:42500, retail:880,  available:false },
      { prog:"ana",       classe:"Éco",      miles:47500, retail:880,  available:false },
      { prog:"fb",        classe:"Éco",      miles:25000, retail:880,  available:true  },
    ]
  },
  {
    dest:"Amsterdam", region:"Europe", icon:"🚲",
    offers:[
      { prog:"fb",        classe:"Éco",      miles:5000,  retail:120,  available:true  },
      { prog:"avios",     classe:"Éco",      miles:4500,  retail:120,  available:true  },
    ]
  },
  {
    dest:"Barcelone", region:"Europe", icon:"🏖️",
    offers:[
      { prog:"avios",     classe:"Éco",      miles:4500,  retail:110,  available:true  },
      { prog:"fb",        classe:"Éco",      miles:5000,  retail:110,  available:true  },
    ]
  },
  {
    dest:"Rome", region:"Europe", icon:"🏛️",
    offers:[
      { prog:"avios",     classe:"Éco",      miles:4500,  retail:130,  available:true  },
      { prog:"fb",        classe:"Éco",      miles:5000,  retail:130,  available:true  },
    ]
  },
  {
    dest:"La Réunion", region:"DOM-TOM", icon:"🌋",
    offers:[
      { prog:"fb",        classe:"Éco",      miles:12500, retail:420,  available:true  },
    ]
  },
  {
    dest:"Martinique", region:"DOM-TOM", icon:"🌸",
    offers:[
      { prog:"fb",        classe:"Éco",      miles:10000, retail:380,  available:true  },
    ]
  },
  {
    dest:"Dakar", region:"Afrique", icon:"🌍",
    offers:[
      { prog:"fb",        classe:"Éco",      miles:15000, retail:480,  available:true  },
      { prog:"avios",     classe:"Éco",      miles:18000, retail:480,  available:false },
    ]
  },
];

const CARD_RULES = [
  { situation:"Achat en ligne",     card:"Revolut",   reason:"Boost jusqu'à ×12 via Shops", icon:"🛒" },
  { situation:"Restaurant / bar",   card:"Amex Gold", reason:"×2 pts restauration",          icon:"🍽️" },
  { situation:"Vol ou hôtel",       card:"Amex Gold", reason:"×2 pts + assurances incluses", icon:"✈️" },
  { situation:"Petit commerce",     card:"Revolut",   reason:"Visa/MC — acceptée partout",   icon:"🏪" },
  { situation:"Achat à l'étranger", card:"Revolut",   reason:"0 frais de change",            icon:"🌍" },
  { situation:"Supermarché",        card:"Amex Gold", reason:"Points sans expiration",       icon:"🛍️" },
];

const FLASH_OFFERS = [
  { dest:"New York",   prog:"fb",        miles:18750, retail:650,  expire:"31 mars", label:"−25% Promo Award",         hot:true,  icon:"🗽" },
  { dest:"Tokyo",      prog:"ana",       miles:35000, retail:1200, expire:"31 mars", label:"Offre saisonnière sakura",  hot:true,  icon:"🗼" },
  { dest:"Dubaï",      prog:"emirates",  miles:22500, retail:680,  expire:"15 mars", label:"Skywards Flash Sale",       hot:true,  icon:"🏙️" },
  { dest:"Barcelone",  prog:"avios",     miles:4500,  retail:110,  expire:"31 mars", label:"Reward Flight Saver",       hot:false, icon:"🏖️" },
  { dest:"Singapour",  prog:"krisflyer", miles:37500, retail:890,  expire:"28 mars", label:"Spontaneous Escapes",       hot:false, icon:"🦁" },
  { dest:"Chicago",    prog:"fb",        miles:18750, retail:610,  expire:"31 mars", label:"−25% Promo Award",         hot:false, icon:"🏙️" },
];

const REGIONS = ["Toutes","Europe","Amérique du Nord","Asie","Afrique","Moyen-Orient","DOM-TOM"];
const CLASSES  = ["Toutes","Éco","Premium Éco","Business","First"];
const SORTS    = [{ id:"cpp", label:"Meilleur rapport" },{ id:"miles", label:"Moins de miles" },{ id:"dest", label:"A→Z" }];

/* ─── HELPERS ───────────────────────────────────────────────── */
const fmtN = n => n.toLocaleString("fr-FR");
const cpp  = (miles, retail) => (retail / miles * 100).toFixed(2);
const getProgram = id => PROGRAMS.find(p => p.id === id);

/* ─── SMALL COMPONENTS ──────────────────────────────────────── */
function Chip({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      fontFamily:"'DM Sans',sans-serif",
      background: active ? (color||C.blue) : C.faint,
      color:      active ? "#fff" : C.muted,
      border:     active ? "none" : `1px solid ${C.border}`,
      borderRadius:999, padding:"5px 13px", fontSize:12,
      fontWeight: active ? 600 : 400, cursor:"pointer",
      whiteSpace:"nowrap", transition:"all .15s",
    }}>{label}</button>
  );
}

function CardTile({ card, editable, onChange }) {
  return (
    <div style={{
      background:C.surface, border:`1px solid ${C.border}`,
      borderRadius:16, padding:"16px 18px",
      display:"flex", justifyContent:"space-between", alignItems:"center",
    }}>
      <div>
        <p style={{ fontSize:11, color:C.muted, marginBottom:4 }}>{card.name}</p>
        {editable
          ? <input type="number" value={card.points}
              onChange={e => onChange(card.id, parseInt(e.target.value)||0)}
              style={{ fontSize:24, fontWeight:700, fontFamily:"'Syne',sans-serif",
                background:"transparent", border:"none", borderBottom:`1px solid ${card.color}`,
                color:C.text, outline:"none", width:120 }} />
          : <p style={{ fontSize:24, fontWeight:700, fontFamily:"'Syne',sans-serif", color:C.text }}>
              {fmtN(card.points)}
            </p>
        }
        <p style={{ fontSize:11, color:card.color, marginTop:3 }}>{card.program}</p>
      </div>
      <div style={{ textAlign:"right" }}>
        {card.monthly > 0
          ? <span style={{ fontSize:11, color:C.muted, background:C.faint, padding:"3px 10px", borderRadius:999 }}>{card.monthly}€/mois</span>
          : <span style={{ fontSize:11, color:C.muted, background:C.faint, padding:"3px 10px", borderRadius:999 }}>Gratuit</span>
        }
        <p style={{ fontSize:13, color:C.muted, marginTop:6 }}>≈ {fmtN(Math.round(card.points*0.018))}€</p>
      </div>
    </div>
  );
}

function RuleRow({ rule }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} style={{
      width:"100%", textAlign:"left",
      background: open ? C.surface : "transparent",
      border:`1px solid ${open ? C.blue+"44" : C.border}`,
      borderRadius:14, padding:"13px 16px", cursor:"pointer", transition:"all .15s",
    }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:20, width:28, textAlign:"center" }}>{rule.icon}</span>
          <span style={{ fontSize:14, color:C.text }}>{rule.situation}</span>
        </div>
        <span style={{ fontSize:10, color:C.muted }}>{open?"▲":"▼"}</span>
      </div>
      {open && (
        <div style={{ marginTop:10, marginLeft:40, display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:12, fontWeight:600, background:`${C.blue}22`, color:C.blue, padding:"3px 12px", borderRadius:999 }}>
            💳 {rule.card}
          </span>
          <span style={{ fontSize:12, color:C.muted }}>{rule.reason}</span>
        </div>
      )}
    </button>
  );
}

function BoostCard({ b }) {
  const [flipped, setFlipped] = useState(false);
  const cardLabel = b.card === "revolut" ? "Revolut" : "Amex Gold";
  const cardColor = b.card === "revolut" ? C.blue : C.gold;
  return (
    <div onClick={() => setFlipped(!flipped)} style={{
      background: flipped ? `${b.color}18` : C.surface,
      border: `1px solid ${flipped ? b.color+"55" : C.border}`,
      borderRadius:16, padding:"14px 14px", cursor:"pointer",
      transition:"all .2s", position:"relative", minHeight:110,
    }}>
      {!flipped ? <>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <span style={{ fontSize:28 }}>{b.logo}</span>
          <span style={{ fontSize:13, fontWeight:800, fontFamily:"'Syne',sans-serif", color:b.color, background:`${b.color}18`, padding:"3px 10px", borderRadius:999 }}>{b.multi}</span>
        </div>
        <p style={{ fontSize:14, color:C.text, fontWeight:600, marginTop:8 }}>{b.brand}</p>
        <p style={{ fontSize:11, color:C.muted, marginTop:2 }}>{b.cat}</p>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8 }}>
          <span style={{ fontSize:10, color:cardColor, background:`${cardColor}18`, padding:"2px 8px", borderRadius:999 }}>{cardLabel}</span>
        </div>
        <p style={{ fontSize:9, color:C.muted, position:"absolute", bottom:10, right:12 }}>Appuie pour + d'infos</p>
      </> : <>
        <p style={{ fontSize:22, marginBottom:6 }}>{b.logo}</p>
        <p style={{ fontSize:14, fontWeight:700, color:C.text }}>{b.brand}</p>
        <p style={{ fontSize:12, color:C.muted, marginTop:6, lineHeight:1.5 }}>{b.tip}</p>
        <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
          <span style={{ fontSize:11, fontWeight:700, color:b.color, background:`${b.color}18`, padding:"3px 10px", borderRadius:999 }}>{b.multi} pts</span>
          <span style={{ fontSize:11, color:cardColor, background:`${cardColor}18`, padding:"3px 10px", borderRadius:999 }}>💳 {cardLabel}</span>
        </div>
        <p style={{ fontSize:9, color:C.muted, position:"absolute", bottom:10, right:12 }}>Appuie pour fermer</p>
      </>}
    </div>
  );
}

/* ─── OFFER BADGE ────────────────────────────────────────────── */
function ProgBadge({ progId, small }) {
  const p = getProgram(progId);
  if (!p) return null;
  return (
    <span style={{
      fontSize: small ? 9 : 10,
      fontWeight:700,
      color:p.color,
      background:`${p.color}22`,
      border:`1px solid ${p.color}44`,
      padding: small ? "1px 6px" : "2px 8px",
      borderRadius:999,
      whiteSpace:"nowrap",
    }}>{p.logo} {p.abbr}</span>
  );
}

/* ─── DESTINATION CARD WITH MULTI-PROGRAMME ─────────────────── */
function DestCard({ dest, totalPoints, rank, maxCpp }) {
  const [expanded, setExpanded] = useState(false);

  // Best offer = highest cpp
  const allOffers = dest.offers.map(o => ({
    ...o,
    cppVal: parseFloat(cpp(o.miles, o.retail)),
    canBook: totalPoints >= o.miles,
    prog: getProgram(o.prog),
  })).sort((a,b) => b.cppVal - a.cppVal);

  const best = allOffers[0];
  const canBookAny = allOffers.some(o => o.canBook);
  const barW = (best.cppVal / maxCpp) * 100;
  const classeColor = best.classe==="Business"||best.classe==="First" ? C.gold : best.classe==="Premium Éco" ? C.purple : C.blue;
  const savings = allOffers.length > 1
    ? Math.round(allOffers[0].cppVal - allOffers[allOffers.length-1].cppVal)
    : null;

  return (
    <div style={{
      background: canBookAny ? `${C.green}0D` : C.surface,
      border:`1px solid ${canBookAny ? C.green+"33" : C.border}`,
      borderRadius:16, overflow:"hidden",
      transition:"all .2s",
    }}>
      {/* Main row */}
      <div style={{ padding:"14px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:22 }}>{dest.icon}</span>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                <p style={{ fontSize:14, color:C.text, fontWeight:500 }}>{dest.dest}</p>
                <span style={{ fontSize:10, padding:"2px 8px", borderRadius:999, background:`${classeColor}22`, color:classeColor, fontWeight:600 }}>{best.classe}</span>
                {rank===0 && <span style={{ fontSize:9, padding:"2px 7px", borderRadius:999, background:`${C.green}22`, color:C.green, fontWeight:700 }}>🏆 BEST</span>}
              </div>
              <div style={{ display:"flex", gap:5, marginTop:4, flexWrap:"wrap", alignItems:"center" }}>
                <p style={{ fontSize:11, color:C.muted }}>{dest.region} · {fmtN(best.miles)} pts</p>
                <ProgBadge progId={best.prog} small />
              </div>
            </div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <p style={{ fontSize:15, fontWeight:700, fontFamily:"'Syne',sans-serif", color:rank===0?C.green:C.text }}>
              {best.cppVal}¢<span style={{ fontSize:10, fontWeight:400, color:C.muted }}>/pt</span>
            </p>
            <p style={{ fontSize:11, color:C.muted }}>val. ~{best.retail}€</p>
          </div>
        </div>

        {/* Bar */}
        <div style={{ background:C.faint, borderRadius:999, height:4, marginBottom:8 }}>
          <div style={{ width:`${barW}%`, height:4, borderRadius:999, background:rank===0?C.green:rank<=2?C.blue:C.faint, transition:"width .5s ease" }} />
        </div>

        {/* Bottom row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {canBookAny && <span style={{ fontSize:11, color:C.green }}>✓ réservable</span>}
            {allOffers.length > 1 && (
              <button onClick={() => setExpanded(!expanded)} style={{
                fontSize:11, color:C.blue, background:"transparent", border:"none", cursor:"pointer", padding:0,
              }}>
                {expanded ? "▲ Masquer" : `▼ ${allOffers.length} offres`}
              </button>
            )}
          </div>
          {savings > 0 && (
            <span style={{ fontSize:10, color:C.teal, background:`${C.teal}15`, padding:"2px 8px", borderRadius:999 }}>
              +{savings}¢ vs pire offre
            </span>
          )}
        </div>
      </div>

      {/* Expanded offers */}
      {expanded && (
        <div style={{ borderTop:`1px solid ${C.border}`, background:C.faint }}>
          <p style={{ fontSize:10, color:C.muted, padding:"8px 16px 4px", fontWeight:600, textTransform:"uppercase", letterSpacing:.5 }}>
            Toutes les options disponibles
          </p>
          {allOffers.map((o, i) => {
            const isBest = i === 0;
            return (
              <div key={i} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"9px 16px",
                borderBottom: i < allOffers.length-1 ? `1px solid ${C.border}` : "none",
                background: isBest ? `${C.green}08` : "transparent",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <ProgBadge progId={o.prog.id} />
                  <div>
                    <p style={{ fontSize:12, color:C.text }}>{o.prog.name}</p>
                    <p style={{ fontSize:10, color:C.muted }}>{o.prog.desc}</p>
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", justifyContent:"flex-end" }}>
                    {isBest && <span style={{ fontSize:9, color:C.green, fontWeight:700 }}>BEST</span>}
                    <span style={{
                      fontSize:10, padding:"2px 7px", borderRadius:999,
                      background:o.classe==="Business"||o.classe==="First"?`${C.gold}22`:`${C.blue}22`,
                      color:o.classe==="Business"||o.classe==="First"?C.gold:C.blue,
                      fontWeight:600,
                    }}>{o.classe}</span>
                  </div>
                  <p style={{ fontSize:13, fontWeight:700, fontFamily:"'Syne',sans-serif", color:isBest?C.green:C.text, marginTop:2 }}>
                    {fmtN(o.miles)} pts
                  </p>
                  <p style={{ fontSize:10, color:C.muted }}>{o.cppVal}¢/pt · ~{o.retail}€</p>
                  {o.canBook
                    ? <p style={{ fontSize:10, color:C.green }}>✓ dispo</p>
                    : <p style={{ fontSize:10, color:C.red }}>−{fmtN(o.miles - totalPoints)} pts</p>
                  }
                  {/* Transfer info */}
                  {o.prog.transferFrom && (
                    <p style={{ fontSize:9, color:C.muted, marginTop:2 }}>
                      via {o.prog.transferFrom.map(t => t==="revolut"?"Revolut":"Amex").join(" ou ")}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Légende programmes */}
          <div style={{ padding:"8px 16px 10px" }}>
            <p style={{ fontSize:9, color:C.muted, lineHeight:1.8 }}>
              💡 Les miles s'obtiennent en transférant tes RevPoints (Revolut) ou Membership Rewards (Amex) vers le programme choisi.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN ──────────────────────────────────────────────────── */
export default function MilesApp() {
  const [tab,          setTab]          = useState("dashboard");
  const [cards,        setCards]        = useState(CARDS_INIT);
  const [editing,      setEditing]      = useState(false);
  const [goal,         setGoal]         = useState(DESTINATIONS[0].offers[0]);
  const [goalDest,     setGoalDest]     = useState(DESTINATIONS[0]);
  const [monthlySpend, setMonthlySpend] = useState(700);
  const [loaded,       setLoaded]       = useState(false);
  const [fRegion,      setFRegion]      = useState("Toutes");
  const [fClasse,      setFClasse]      = useState("Toutes");
  const [fProg,        setFProg]        = useState("Toutes");
  const [fDispo,       setFDispo]       = useState(false);
  const [fSort,        setFSort]        = useState("cpp");
  const [fCat,         setFCat]         = useState("Toutes");
  const [fCardBoost,   setFCardBoost]   = useState("Toutes");
  const [activeCards,  setActiveCards]  = useState({ revolut:true, amex:true });
  const [showSetup,    setShowSetup]    = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  // Programmes accessibles selon les cartes actives
  const accessibleProgIds = PROGRAMS
    .filter(p => p.transferFrom.some(c => activeCards[c]))
    .map(p => p.id);

  const totalPoints    = cards.reduce((a,c) => a+c.points, 0);
  const totalValue     = Math.round(totalPoints * 0.018);
  const monthlyAccrual = Math.round(
    cards.filter(c => c.accrual>0 && activeCards[c.id] !== false)
         .reduce((a,c) => a+c.accrual, 0) * monthlySpend * 0.6
  );
  const missingPoints  = Math.max(0, goal.miles - totalPoints);
  const monthsNeeded   = missingPoints > 0 ? Math.ceil(missingPoints / Math.max(monthlyAccrual,1)) : 0;

  const updatePoints = (id, val) => setCards(prev => prev.map(c => c.id===id ? {...c, points:val} : c));
  const toggleCard   = (id) => setActiveCards(prev => ({ ...prev, [id]: !prev[id] }));

  // Offres flash filtrées selon programmes accessibles
  const visibleFlash = FLASH_OFFERS.filter(o => accessibleProgIds.includes(o.prog));

  // Group by destination, filter and find best offer per dest
  const filteredDests = DESTINATIONS
    .map(dest => {
      const relevantOffers = dest.offers.filter(o => {
        if (!accessibleProgIds.includes(o.prog)) return false;
        if (fClasse !== "Toutes" && o.classe !== fClasse) return false;
        if (fProg !== "Toutes" && o.prog !== fProg) return false;
        if (fDispo && totalPoints < o.miles) return false;
        return true;
      });
      if (relevantOffers.length === 0) return null;
      if (fRegion !== "Toutes" && dest.region !== fRegion) return null;
      return { ...dest, offers: relevantOffers };
    })
    .filter(Boolean)
    .map(dest => ({
      ...dest,
      bestCpp: Math.max(...dest.offers.map(o => parseFloat(cpp(o.miles, o.retail)))),
      minMiles: Math.min(...dest.offers.map(o => o.miles)),
    }))
    .sort((a,b) => fSort==="cpp" ? b.bestCpp-a.bestCpp : fSort==="miles" ? a.minMiles-b.minMiles : a.dest.localeCompare(b.dest));

  const maxCpp = filteredDests.length ? filteredDests[0].bestCpp : 1;

  const filteredBoosts = BOOSTS
    .filter(b => activeCards[b.card] !== false)
    .filter(b => fCat==="Toutes" || b.cat===fCat)
    .filter(b => fCardBoost==="Toutes" || b.card===fCardBoost)
    .sort((a,b) => parseInt(b.multi.replace("×","")) - parseInt(a.multi.replace("×","")));

  const topBoosts = [...BOOSTS]
    .filter(b => activeCards[b.card] !== false)
    .sort((a,b)=>parseInt(b.multi.replace("×",""))-parseInt(a.multi.replace("×",""))).slice(0,3);

  const GOALS_QUICK = DESTINATIONS.slice(0, 6);

  const s = {
    label:   { fontSize:13, fontWeight:600, color:C.text, marginBottom:8, fontFamily:"'Syne',sans-serif" },
    section: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"14px 16px" },
  };

  const TABS = [
    { id:"dashboard",   label:"🏠" },
    { id:"boosts",      label:"⚡" },
    { id:"simulator",   label:"🎯" },
    { id:"compare",     label:"🔍" },
    { id:"guide",       label:"📚" },
    { id:"cardsguide",  label:"🃏" },
  ];

  const [guideSection, setGuideSection] = useState("faq");
  const [cardsBrand,   setCardsBrand]   = useState("revolut");
  const [openCard,     setOpenCard]     = useState(null);
  const [openFaq,      setOpenFaq]      = useState(null);
  const [openGuide,    setOpenGuide]    = useState(null);

  const FAQ_DATA = [
    { q:"C'est quoi un mile / un point ?", a:"Un mile (ou point) est une unité de fidélité offerte par les programmes des compagnies aériennes ou les cartes bancaires. Tu en accumules en dépensant de l'argent, puis tu les échanges contre des vols, surclassements ou services." },
    { q:"Quelle est la différence entre RevPoints et miles ?", a:"Les RevPoints sont les points de ta carte Revolut. Ils ne sont pas directement utilisables pour des vols — il faut les transférer vers un programme aérien (Flying Blue, Avios...) qui, lui, émet des miles utilisables pour réserver." },
    { q:"Est-ce que mes points expirent ?", a:"Ça dépend du programme. Les Membership Rewards Amex n'expirent jamais. Les RevPoints expirent si ton compte est inactif 12 mois. Les miles Flying Blue expirent après 24 mois sans activité. Vérifie régulièrement dans l'app." },
    { q:"Comment transférer mes RevPoints vers Flying Blue ?", a:"Dans l'app Revolut, va dans 'Points' → 'Convertir' → sélectionne Flying Blue → entre ton numéro de membre. Le transfert est quasi immédiat mais irréversible — choisis bien ton programme avant." },
    { q:"Combien vaut un mile en euros ?", a:"En moyenne, un mile vaut entre 1,5 et 2,5 centimes d'euro. Mais la vraie valeur dépend de comment tu l'utilises : un vol Business peut valoir 3 à 4¢/pt, un cashback seulement 0,8¢/pt. Le comparateur t'indique le meilleur rapport." },
    { q:"Peut-on cumuler des points avec Revolut ET Amex ?", a:"Oui, c'est même la stratégie recommandée ! Tu utilises Revolut pour les achats en ligne (boosts ×4 à ×12) et Amex pour restaurants et voyages (×2 pts). Tu transfères ensuite tout vers le même programme pour atteindre tes objectifs plus vite." },
    { q:"C'est quoi une Promo Award ?", a:"C'est une promotion mensuelle de Flying Blue qui réduit le coût en miles de certains vols de 25 à 50%. Elle change chaque mois — d'où l'intérêt de surveiller les Offres Flash dans l'app pour ne jamais rater une opportunité." },
  ];

  const GUIDES_DATA = [
    { title:"Mon premier transfert Revolut → Flying Blue", duration:"5 min", icon:"🔄", color:"#5B7FFF", steps:["Ouvre l'app Revolut et va dans l'onglet 'Points'","Appuie sur 'Convertir mes points'","Sélectionne 'Flying Blue' dans la liste des partenaires","Entre ton numéro de membre Flying Blue (format : 123-456789)","Choisis le nombre de points à transférer (min. 500 RevPoints)","Confirme — les miles arrivent en quelques minutes","⚠️ Le transfert est irréversible : vérifie bien avant de confirmer"] },
    { title:"Maximiser ses points sur un achat Amazon", duration:"3 min", icon:"📦", color:"#F07840", steps:["Ouvre l'app Revolut et va dans 'Shops'","Recherche Amazon dans la liste des marchands","Appuie sur 'Activer le boost' (×8 RevPoints actuellement)","Tu es redirigé vers Amazon — ne ferme pas et ne change pas d'onglet","Fais ton achat normalement avec ta carte Revolut","Les points bonus arrivent sous 30 jours après livraison","💡 Le boost doit être activé AVANT chaque achat"] },
    { title:"Réserver un vol Business avec des miles", duration:"10 min", icon:"✈️", color:"#D4A843", steps:["Vérifie d'abord que tu as assez de miles via le Simulateur","Va sur airfrance.fr → connecte-toi à ton compte Flying Blue","Dans le moteur de recherche, active 'Payer en miles'","Sélectionne ta destination et tes dates (flexibilité = moins de miles)","Filtre par 'Business' et choisis un vol disponible en award","Lors du paiement, sélectionne 'Miles' comme mode de paiement","💡 Les Promo Awards réduisent le tarif de 25% — surveille les Offres Flash !"] },
    { title:"Choisir entre Revolut et Amex selon la situation", duration:"2 min", icon:"💳", color:"#9B6FE0", steps:["Achat en ligne → toujours Revolut (boosts jusqu'à ×12 via Shops)","Restaurant, bar, café → Amex Gold (×2 pts sur restauration)","Vol ou hôtel → Amex Gold (×2 pts + assurances voyage incluses)","Commerce de proximité → Revolut (acceptée partout via Visa/Mastercard)","À l'étranger → Revolut (0 frais de change jusqu'à 1000€/mois)","Grande surface → au choix, les deux donnent 1 pt/€ de base","💡 Installe les deux apps et développe le réflexe naturellement"] },
  ];

  const TIPS_DATA = [
    { title:"Le boost Nike à ×12 — profites-en avant fin mars", tag:"Expire bientôt", color:"#F06070", icon:"🔥", body:"Revolut propose actuellement un boost exceptionnel ×12 sur Nike via le portail Shops. C'est le meilleur taux disponible en ce moment sur toute la plateforme. Si tu as des achats sport prévus, c'est le moment." },
    { title:"Combiner Promo Award + upgrade Business", tag:"Stratégie avancée", color:"#D4A843", icon:"💡", body:"Réserve un vol Éco avec une Promo Award Flying Blue (−25%), puis utilise des miles supplémentaires pour demander un surclassement Business. Tu peux obtenir un Business à moins de 60 000 miles au lieu de 80 000." },
    { title:"ANA : la pépite cachée pour le Japon", tag:"Bon plan", color:"#2EC4B6", icon:"🗼", body:"Le programme ANA (transférable depuis Amex) permet de réserver Tokyo en Business pour seulement 55 000 miles — soit 25 000 de moins que Flying Blue pour le même vol. Seul prérequis : avoir une carte Amex Gold." },
    { title:"Ne transfère pas trop tôt", tag:"Conseil clé", color:"#9B6FE0", icon:"⚠️", body:"Les RevPoints et Membership Rewards n'expirent pas si tu utilises ta carte régulièrement. Attends d'avoir assez de miles pour ta destination cible avant de transférer — les miles dans les programmes aériens expirent plus vite." },
    { title:"Le ratio magique : 1,8¢/pt", tag:"À retenir", color:"#3EC98A", icon:"📊", body:"En dessous de 1,5¢/pt, une utilisation est considérée mauvaise (cashback, shopping). Au-dessus de 2¢/pt, c'est excellent. Vise toujours les destinations qui affichent 2¢/pt ou plus dans le comparateur." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:${C.bg}; }
        .scroll-x { display:flex; gap:6px; overflow-x:auto; padding-bottom:4px; }
        .scroll-x::-webkit-scrollbar { display:none; }
        input[type=range] { width:100%; accent-color:${C.blue}; }
        input[type=number]::-webkit-inner-spin-button { opacity:.3; }
      `}</style>

      <div style={{ fontFamily:"'DM Sans',sans-serif", background:C.bg, minHeight:"100vh", display:"flex", justifyContent:"center" }}>
        <div style={{ width:"100%", maxWidth:430, position:"relative", paddingBottom:80 }}>

          {/* Header */}
          <div style={{ padding:"24px 20px 16px", background:`linear-gradient(180deg, #1C1E2A 0%, transparent 100%)`, position:"sticky", top:0, zIndex:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <h1 style={{ fontSize:22, fontWeight:800, fontFamily:"'Syne',sans-serif", color:C.text, letterSpacing:-0.5 }}>
                  Miles<span style={{ color:C.blue }}>Optimizer</span>
                </h1>
                <p style={{ fontSize:11, color:C.muted, marginTop:2 }}>
                  {fmtN(totalPoints)} pts · ≈ {fmtN(totalValue)}€ · <span style={{ color:C.green }}>{accessibleProgIds.length} programmes actifs</span>
                </p>
              </div>
              <button onClick={() => setShowSetup(!showSetup)} style={{
                background: showSetup ? `${C.blue}22` : C.faint,
                border: `1px solid ${showSetup ? C.blue+"44" : C.border}`,
                borderRadius:12, padding:"8px 12px", cursor:"pointer",
                display:"flex", flexDirection:"column", gap:3, alignItems:"center",
              }}>
                <span style={{ fontSize:16 }}>⚙️</span>
                <span style={{ fontSize:9, color:C.muted, fontFamily:"'DM Sans',sans-serif" }}>Mes cartes</span>
              </button>
            </div>

            {/* Setup panel */}
            {showSetup && (
              <div style={{ marginTop:12, background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"14px 16px" }}>
                <p style={{ fontSize:12, fontWeight:600, color:C.text, marginBottom:10 }}>💳 Quelles cartes as-tu ?</p>
                <p style={{ fontSize:11, color:C.muted, marginBottom:12, lineHeight:1.5 }}>
                  Active uniquement les cartes que tu possèdes. Les programmes et offres s'adapteront automatiquement.
                </p>
                {[
                  { id:"revolut", name:"Revolut Premium", color:C.blue,  desc:"RevPoints · Shops boosts" },
                  { id:"amex",    name:"Amex Gold",        color:C.gold,  desc:"Membership Rewards · 1:1 transfers" },
                ].map(card => (
                  <div key={card.id} onClick={() => toggleCard(card.id)} style={{
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                    padding:"10px 12px", borderRadius:12, marginBottom:8, cursor:"pointer",
                    background: activeCards[card.id] ? `${card.color}18` : C.faint,
                    border: `1px solid ${activeCards[card.id] ? card.color+"44" : C.border}`,
                    transition:"all .15s",
                  }}>
                    <div>
                      <p style={{ fontSize:13, color: activeCards[card.id] ? C.text : C.muted, fontWeight:500 }}>{card.name}</p>
                      <p style={{ fontSize:10, color:C.muted }}>{card.desc}</p>
                    </div>
                    <div style={{
                      width:36, height:20, borderRadius:999,
                      background: activeCards[card.id] ? card.color : C.faint,
                      border: `1px solid ${activeCards[card.id] ? card.color : C.border}`,
                      position:"relative", transition:"all .2s",
                    }}>
                      <div style={{
                        width:14, height:14, borderRadius:"50%", background:"#fff",
                        position:"absolute", top:2,
                        left: activeCards[card.id] ? 18 : 2,
                        transition:"left .2s",
                      }} />
                    </div>
                  </div>
                ))}
                {/* Show which programmes unlocked */}
                <div style={{ marginTop:8 }}>
                  <p style={{ fontSize:10, color:C.muted, marginBottom:6 }}>Programmes débloqués :</p>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    {PROGRAMS.map(p => {
                      const unlocked = accessibleProgIds.includes(p.id);
                      return (
                        <span key={p.id} style={{
                          fontSize:10, padding:"2px 8px", borderRadius:999, fontWeight:600,
                          color: unlocked ? p.color : C.muted,
                          background: unlocked ? `${p.color}22` : C.faint,
                          border: `1px solid ${unlocked ? p.color+"44" : C.border}`,
                          opacity: unlocked ? 1 : 0.5,
                        }}>{p.logo} {p.abbr}</span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:12, opacity:loaded?1:0, transition:"opacity .3s" }}>

            {/* ══ DASHBOARD ══ */}
            {tab==="dashboard" && <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <p style={s.label}>Mes cartes</p>
                <button onClick={() => setEditing(!editing)} style={{
                  fontSize:11, padding:"4px 12px", borderRadius:999, cursor:"pointer",
                  background:editing?`${C.blue}22`:C.faint, color:editing?C.blue:C.muted,
                  border:editing?`1px solid ${C.blue}44`:`1px solid ${C.border}`,
                  fontFamily:"'DM Sans',sans-serif",
                }}>{editing?"✓ Enregistrer":"✎ Modifier"}</button>
              </div>
              {cards.map(c => <CardTile key={c.id} card={c} editable={editing} onChange={updatePoints} />)}

              <div style={{ ...s.section, background:`${C.orange}0E`, border:`1px solid ${C.orange}33` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:C.text }}>⚡ Top boosts du moment</p>
                  <button onClick={() => setTab("boosts")} style={{ fontSize:11, color:C.blue, background:"transparent", border:"none", cursor:"pointer" }}>Voir tout →</button>
                </div>
                {topBoosts.map((b,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:i<topBoosts.length-1?`1px solid ${C.border}`:"none" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:20 }}>{b.logo}</span>
                      <div><p style={{ fontSize:13, color:C.text }}>{b.brand}</p><p style={{ fontSize:10, color:C.muted }}>{b.cat}</p></div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:13, fontWeight:800, fontFamily:"'Syne',sans-serif", color:b.color }}>{b.multi}</span>
                      <span style={{ fontSize:10, color:b.card==="revolut"?C.blue:C.gold, background:b.card==="revolut"?`${C.blue}18`:`${C.gold}18`, padding:"2px 7px", borderRadius:999 }}>
                        {b.card==="revolut"?"Revolut":"Amex"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Programmes summary */}
              <div style={s.section}>
                <p style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:10 }}>🌐 Programmes actifs</p>
                {PROGRAMS.map((p,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:i<PROGRAMS.length-1?`1px solid ${C.border}`:"none" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:14 }}>{p.logo}</span>
                      <div>
                        <p style={{ fontSize:13, color:C.text }}>{p.name}</p>
                        <p style={{ fontSize:10, color:C.muted }}>{p.desc}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:4 }}>
                      {p.transferFrom.map(t => (
                        <span key={t} style={{ fontSize:9, color:t==="revolut"?C.blue:C.gold, background:t==="revolut"?`${C.blue}18`:`${C.gold}18`, padding:"2px 7px", borderRadius:999, fontWeight:600 }}>
                          {t==="revolut"?"Revolut":"Amex"}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:4 }}>
                <p style={s.label}>🔥 Offres Flash du mois</p>
                <span style={{ fontSize:10, color:C.muted, background:C.faint, padding:"2px 8px", borderRadius:999 }}>Mars 2026</span>
              </div>
              {visibleFlash.map((p,i) => {
                const prog = PROGRAMS.find(pr => pr.id === p.prog);
                const canBook = totalPoints >= p.miles;
                const saving = Math.round(p.retail * 0.25);
                return (
                  <div key={i} style={{ background:canBook?`${C.green}0D`:C.surface, border:`1px solid ${canBook?C.green+"33":C.border}`, borderRadius:14, padding:"12px 16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        {p.hot && <span style={{ width:7, height:7, borderRadius:"50%", background:C.red, display:"inline-block", flexShrink:0, marginTop:3 }} />}
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                            <p style={{ fontSize:13, color:C.text }}>{p.icon} {p.dest}</p>
                            {prog && <ProgBadge progId={prog.id} small />}
                          </div>
                          <p style={{ fontSize:10, color:C.muted, marginTop:2 }}>{p.label} · expire le {p.expire}</p>
                          <p style={{ fontSize:10, color:C.orange, marginTop:1 }}>économie ~{saving}€ vs tarif cash</p>
                        </div>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <p style={{ fontSize:14, fontWeight:700, fontFamily:"'Syne',sans-serif", color:prog?.color||C.blue }}>{fmtN(p.miles)}</p>
                        <p style={{ fontSize:10, color:C.muted }}>pts</p>
                        {canBook
                          ? <p style={{ fontSize:11, color:C.green, marginTop:2 }}>✓ dispo</p>
                          : <p style={{ fontSize:11, color:C.muted, marginTop:2 }}>−{fmtN(p.miles-totalPoints)}</p>
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
            </>}

            {/* ══ BOOSTS ══ */}
            {tab==="boosts" && <>
              <div>
                <p style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:4 }}>⚡ Marques boostées</p>
                <p style={{ fontSize:12, color:C.muted }}>Appuie sur une marque pour voir les détails.</p>
              </div>
              <div>
                <p style={{ fontSize:11, color:C.muted, marginBottom:6 }}>Carte</p>
                <div className="scroll-x">
                  {["Toutes","revolut","amex"].map(c => (
                    <Chip key={c} label={c==="Toutes"?"Toutes":c==="revolut"?"Revolut":"Amex Gold"} active={fCardBoost===c} onClick={() => setFCardBoost(c)} color={c==="revolut"?C.blue:C.gold} />
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize:11, color:C.muted, marginBottom:6 }}>Catégorie</p>
                <div className="scroll-x">{CATS.map(c => <Chip key={c} label={c} active={fCat===c} onClick={() => setFCat(c)} />)}</div>
              </div>
              <p style={{ fontSize:11, color:C.muted }}>{filteredBoosts.length} marque{filteredBoosts.length>1?"s":""} · triées par meilleur boost</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {filteredBoosts.map((b,i) => <BoostCard key={i} b={b} />)}
              </div>
              {filteredBoosts.length===0 && (
                <div style={{ ...s.section, textAlign:"center", padding:"32px 18px" }}>
                  <p style={{ fontSize:28, marginBottom:8 }}>🔍</p>
                  <p style={{ fontSize:13, color:C.muted }}>Aucune marque pour ces filtres.</p>
                  <button onClick={() => { setFCat("Toutes"); setFCardBoost("Toutes"); }} style={{ marginTop:12, fontSize:12, color:C.blue, background:"transparent", border:"none", cursor:"pointer" }}>Réinitialiser</button>
                </div>
              )}
              <div style={{ ...s.section, background:`${C.gold}0E`, border:`1px solid ${C.gold}33` }}>
                <p style={{ fontSize:11, color:C.gold, fontWeight:600, marginBottom:6 }}>💡 Le saviez-vous ?</p>
                <p style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>Passer par le portail Shops Revolut avant d'acheter sur Amazon ou Nike peut multiplier tes points par 8 à 12 — sans changer tes habitudes d'achat.</p>
              </div>
            </>}

            {/* ══ SIMULATEUR ══ */}
            {tab==="simulator" && <>
              <p style={s.label}>Objectif de voyage</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {GOALS_QUICK.map((dest, i) => {
                  const bestOffer = dest.offers.sort((a,b) => parseFloat(cpp(a.miles,a.retail)) > parseFloat(cpp(b.miles,b.retail)) ? -1 : 1)[0];
                  const active = goalDest.dest === dest.dest;
                  return (
                    <button key={i} onClick={() => { setGoalDest(dest); setGoal(bestOffer); }} style={{
                      background:active?`${C.blue}22`:C.surface,
                      border:`1px solid ${active?C.blue+"66":C.border}`,
                      borderRadius:14, padding:"12px 14px", textAlign:"left", cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                    }}>
                      <p style={{ fontSize:18, marginBottom:4 }}>{dest.icon}</p>
                      <p style={{ fontSize:12, color:C.text }}>{dest.dest}</p>
                      <p style={{ fontSize:11, color:C.muted }}>{bestOffer.classe}</p>
                      <p style={{ fontSize:12, fontWeight:700, color:C.blue, marginTop:4 }}>{fmtN(bestOffer.miles)} pts</p>
                      <div style={{ marginTop:4 }}><ProgBadge progId={bestOffer.prog} small /></div>
                    </button>
                  );
                })}
              </div>

              <div style={{ ...s.section, background:`${C.blue}11`, border:`1px solid ${C.blue}33` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <p style={{ fontSize:13, color:C.text }}>{goalDest.icon} {goalDest.dest} — {goal.classe}</p>
                  <p style={{ fontSize:12, color:C.muted }}>{fmtN(goal.miles)} pts</p>
                </div>
                <div style={{ background:C.faint, borderRadius:999, height:6, marginBottom:8 }}>
                  <div style={{ width:`${Math.min((totalPoints/goal.miles)*100,100)}%`, height:6, borderRadius:999, transition:"width .6s ease", background:totalPoints>=goal.miles?C.green:C.blue }} />
                </div>
                {totalPoints>=goal.miles
                  ? <p style={{ fontSize:13, color:C.green }}>✓ Objectif atteint — tu peux réserver !</p>
                  : <p style={{ fontSize:13, color:C.muted }}>Il manque <span style={{ color:C.text, fontWeight:600 }}>{fmtN(missingPoints)} pts</span></p>
                }
              </div>

              <div style={s.section}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <p style={{ fontSize:13, color:C.text }}>Dépenses mensuelles</p>
                  <p style={{ fontSize:14, fontWeight:600, color:C.text }}>{fmtN(monthlySpend)}€/mois</p>
                </div>
                <input type="range" min={100} max={3000} step={50} value={monthlySpend} onChange={e=>setMonthlySpend(+e.target.value)} />
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:12 }}>
                  {[
                    { label:"Points / mois", val:fmtN(monthlyAccrual) },
                    { label:"Mois restants",  val:monthsNeeded===0?"0 ✓":monthsNeeded },
                    { label:"Valeur / an",    val:`${fmtN(Math.round(monthlyAccrual*12*0.018))}€` },
                  ].map((s2,i) => (
                    <div key={i} style={{ background:C.faint, borderRadius:12, padding:"10px 8px", textAlign:"center" }}>
                      <p style={{ fontSize:18, fontWeight:700, fontFamily:"'Syne',sans-serif", color:C.text }}>{s2.val}</p>
                      <p style={{ fontSize:10, color:C.muted, marginTop:2 }}>{s2.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...s.section, background:`${C.gold}11`, border:`1px solid ${C.gold}33` }}>
                <p style={{ fontSize:11, color:C.gold, fontWeight:600, marginBottom:6 }}>💡 Conseil personnalisé</p>
                <p style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>
                  {monthsNeeded===0
                    ? `Tu as assez de points pour ${goalDest.dest}. Réserve pendant les Promo Awards pour économiser 25% supplémentaires.`
                    : monthsNeeded<=6
                    ? `En activant les boosts Revolut Shops (×8 Amazon, ×12 Nike), tu peux atteindre ton objectif en ${Math.ceil(monthsNeeded*0.6)} mois.`
                    : `Le bonus de bienvenue Amex Gold (~15 000 pts) réduirait ton délai à environ ${Math.max(1,monthsNeeded-4)} mois.`
                  }
                </p>
              </div>
            </>}

            {/* ══ COMPARATEUR MULTI-PROGRAMME ══ */}
            {tab==="compare" && <>
              <div>
                <p style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:4 }}>🔍 Comparateur multi-programmes</p>
                <p style={{ fontSize:12, color:C.muted }}>Trouve la meilleure option parmi 5 programmes de miles.</p>
              </div>

              {/* Filtre programme */}
              <div>
                <p style={{ fontSize:11, color:C.muted, marginBottom:6 }}>Programme</p>
                <div className="scroll-x">
                  <Chip label="Tous" active={fProg==="Toutes"} onClick={() => setFProg("Toutes")} />
                  {PROGRAMS.filter(p => accessibleProgIds.includes(p.id)).map(p => (
                    <Chip key={p.id} label={`${p.logo} ${p.abbr}`} active={fProg===p.id} onClick={() => setFProg(p.id)} color={p.color} />
                  ))}
                </div>
              </div>

              {/* Filtre région */}
              <div>
                <p style={{ fontSize:11, color:C.muted, marginBottom:6 }}>Région</p>
                <div className="scroll-x">{REGIONS.map(r => <Chip key={r} label={r} active={fRegion===r} onClick={() => setFRegion(r)} />)}</div>
              </div>

              {/* Filtre classe */}
              <div>
                <p style={{ fontSize:11, color:C.muted, marginBottom:6 }}>Classe</p>
                <div className="scroll-x">{CLASSES.map(c => <Chip key={c} label={c} active={fClasse===c} onClick={() => setFClasse(c)} color={c==="Business"||c==="First"?C.gold:c==="Premium Éco"?C.purple:C.blue} />)}</div>
              </div>

              {/* Sort & dispo */}
              <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                <p style={{ fontSize:11, color:C.muted, flexShrink:0 }}>Trier :</p>
                {SORTS.map(s2 => <Chip key={s2.id} label={s2.label} active={fSort===s2.id} onClick={() => setFSort(s2.id)} />)}
                <Chip label={fDispo?"✓ Réservable":"Réservable"} active={fDispo} onClick={() => setFDispo(!fDispo)} color={C.green} />
              </div>

              <p style={{ fontSize:11, color:C.muted }}>{filteredDests.length} destination{filteredDests.length>1?"s":""} trouvée{filteredDests.length>1?"s":""}</p>

              {filteredDests.length===0 && (
                <div style={{ ...s.section, textAlign:"center", padding:"32px 18px" }}>
                  <p style={{ fontSize:28, marginBottom:8 }}>🔍</p>
                  <p style={{ fontSize:13, color:C.muted }}>Aucune destination ne correspond.</p>
                  <button onClick={() => { setFRegion("Toutes"); setFClasse("Toutes"); setFDispo(false); setFProg("Toutes"); }} style={{ marginTop:12, fontSize:12, color:C.blue, background:"transparent", border:"none", cursor:"pointer" }}>Réinitialiser</button>
                </div>
              )}

              {filteredDests.map((dest, i) => (
                <DestCard key={i} dest={dest} totalPoints={totalPoints} rank={i} maxCpp={maxCpp} />
              ))}

              {/* Légende programmes */}
              {filteredDests.length > 0 && (
                <div style={{ ...s.section, background:`${C.teal}0D`, border:`1px solid ${C.teal}33` }}>
                  <p style={{ fontSize:11, color:C.teal, fontWeight:600, marginBottom:8 }}>🌐 Légende des programmes</p>
                  {PROGRAMS.map((p,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:i<PROGRAMS.length-1?6:0 }}>
                      <ProgBadge progId={p.id} />
                      <p style={{ fontSize:11, color:C.muted }}>{p.name} — {p.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </>}

            {/* ══ CARTE ══ */}
            {tab==="card" && <>
              <p style={s.label}>Assistant — quelle carte utiliser ?</p>
              <p style={{ fontSize:12, color:C.muted }}>Clique sur ta situation pour voir la recommandation.</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {CARD_RULES.map((r,i) => <RuleRow key={i} rule={r} />)}
              </div>
              <div style={{ ...s.section, marginTop:8 }}>
                <p style={{ ...s.label, marginBottom:12 }}>Ton profil voyageur</p>
                {[
                  { label:"Europe + Long courrier", icon:"🌍" },
                  { label:"1 à 2 voyages par an",   icon:"📅" },
                  { label:"Budget flexible",          icon:"💰" },
                ].map((p,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                    <span style={{ fontSize:16, width:24, textAlign:"center" }}>{p.icon}</span>
                    <span style={{ fontSize:13, color:C.muted }}>{p.label}</span>
                  </div>
                ))}
                <div style={{ background:`${C.blue}15`, border:`1px solid ${C.blue}33`, borderRadius:12, padding:"12px 14px", marginTop:4 }}>
                  <p style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>
                    Stratégie recommandée : <span style={{ color:C.text }}>Revolut Premium</span> pour le quotidien + <span style={{ color:C.text }}>Amex Gold</span> pour restaurants & voyages. Transfère vers le programme offrant le <span style={{ color:C.text }}>meilleur rapport</span> selon ta destination.
                  </p>
                </div>
              </div>
            </>}

            {/* ══ CARTES GUIDE ══ */}
            {tab==="cardsguide" && <>
              <div>
                <p style={{ fontSize:16, fontWeight:700, color:"#E8EAF0", marginBottom:4 }}>🃏 Choisir sa carte</p>
                <p style={{ fontSize:12, color:"rgba(232,234,240,0.4)" }}>Compare les offres Revolut et Amex pour trouver celle qui te correspond.</p>
              </div>

              {/* Brand toggle */}
              <div style={{ display:"flex", gap:8 }}>
                {[{id:"revolut",label:"💙 Revolut",color:"#5B7FFF"},{id:"amex",label:"🟡 Amex",color:"#D4A843"}].map(b => (
                  <button key={b.id} onClick={() => { setCardsBrand(b.id); setOpenCard(null); }} style={{
                    flex:1, padding:"10px 0", borderRadius:12, cursor:"pointer",
                    fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight: cardsBrand===b.id ? 700 : 400,
                    background: cardsBrand===b.id ? `${b.color}22` : "rgba(232,234,240,0.05)",
                    color: cardsBrand===b.id ? b.color : "rgba(232,234,240,0.4)",
                    border: `1px solid ${cardsBrand===b.id ? b.color+"55" : "rgba(255,255,255,0.08)"}`,
                    transition:"all .15s",
                  }}>{b.label}</button>
                ))}
              </div>

              {/* Revolut plans */}
              {cardsBrand==="revolut" && <>
                <p style={{ fontSize:11, color:"rgba(232,234,240,0.4)" }}>5 offres disponibles — de la gratuite à l'ultra premium</p>
                {REVOLUT_PLANS.map((plan, i) => (
                  <div key={i} style={{
                    background: openCard===i ? "#252837" : "transparent",
                    border:`1px solid ${openCard===i ? plan.color+"55" : plan.hot ? plan.color+"33" : "rgba(255,255,255,0.08)"}`,
                    borderRadius:16, overflow:"hidden", transition:"all .15s",
                  }}>
                    <div onClick={() => setOpenCard(openCard===i ? null : i)} style={{ padding:"14px 16px", cursor:"pointer" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:36, height:36, borderRadius:10, background:`${plan.color}22`, border:`1.5px solid ${plan.color}44`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <span style={{ fontSize:11, fontWeight:800, color:plan.color }}>R</span>
                          </div>
                          <div>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <p style={{ fontSize:14, color:"#E8EAF0", fontWeight:600 }}>Revolut {plan.name}</p>
                              {plan.hot && <span style={{ fontSize:9, color:"#3EC98A", background:"#3EC98A22", padding:"2px 7px", borderRadius:999, fontWeight:700 }}>⭐ RECOMMANDÉ</span>}
                            </div>
                            <p style={{ fontSize:11, color:plan.color, marginTop:2 }}>{plan.badge} · {plan.ideal}</p>
                          </div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <p style={{ fontSize:16, fontWeight:800, fontFamily:"'Syne',sans-serif", color:plan.color }}>{plan.price === 0 ? "0€" : `${plan.price}€`}</p>
                          <p style={{ fontSize:9, color:"rgba(232,234,240,0.4)" }}>/mois</p>
                        </div>
                      </div>
                    </div>
                    {openCard===i && (
                      <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", padding:"12px 16px 16px" }}>
                        <div style={{ background:`${plan.color}11`, borderRadius:10, padding:"8px 12px", marginBottom:10 }}>
                          <p style={{ fontSize:11, color:plan.color, fontWeight:600 }}>Accumulation : {plan.points}</p>
                        </div>
                        <p style={{ fontSize:11, color:"rgba(232,234,240,0.6)", fontWeight:600, marginBottom:6 }}>✅ Avantages</p>
                        {plan.avantages.map((a,j) => (
                          <div key={j} style={{ display:"flex", gap:8, marginBottom:5 }}>
                            <span style={{ color:"#3EC98A", flexShrink:0 }}>•</span>
                            <p style={{ fontSize:12, color:"rgba(232,234,240,0.6)", lineHeight:1.5 }}>{a}</p>
                          </div>
                        ))}
                        <p style={{ fontSize:11, color:"rgba(232,234,240,0.6)", fontWeight:600, marginTop:10, marginBottom:6 }}>⚠️ Limites</p>
                        {plan.limites.map((l,j) => (
                          <div key={j} style={{ display:"flex", gap:8, marginBottom:5 }}>
                            <span style={{ color:"#F06070", flexShrink:0 }}>•</span>
                            <p style={{ fontSize:12, color:"rgba(232,234,240,0.5)", lineHeight:1.5 }}>{l}</p>
                          </div>
                        ))}
                        <div style={{ background:"rgba(232,234,240,0.05)", borderRadius:10, padding:"10px 12px", marginTop:10, borderLeft:`3px solid ${plan.color}` }}>
                          <p style={{ fontSize:12, color:"rgba(232,234,240,0.7)", lineHeight:1.6, fontStyle:"italic" }}>💬 {plan.who}</p>
                        </div>
                        {/* Détails enrichis */}
                        {plan.details?.assurance && (
                          <div style={{ marginTop:10 }}>
                            <p style={{ fontSize:11, color:"rgba(232,234,240,0.6)", fontWeight:600, marginBottom:5 }}>🛡️ Assurance incluse</p>
                            <p style={{ fontSize:12, color:"rgba(232,234,240,0.5)", lineHeight:1.6 }}>{plan.details.assurance}</p>
                          </div>
                        )}
                        {plan.details?.abonnements && (
                          <div style={{ marginTop:10 }}>
                            <p style={{ fontSize:11, color:"rgba(232,234,240,0.6)", fontWeight:600, marginBottom:5 }}>🎁 Abonnements inclus</p>
                            <p style={{ fontSize:12, color:"rgba(232,234,240,0.5)", lineHeight:1.6 }}>{plan.details.abonnements}</p>
                          </div>
                        )}
                        {plan.details?.bienvenue && (
                          <div style={{ marginTop:10, background:"rgba(62,201,138,0.08)", border:"1px solid rgba(62,201,138,0.25)", borderRadius:10, padding:"10px 12px" }}>
                            <p style={{ fontSize:11, color:"#3EC98A", fontWeight:600, marginBottom:4 }}>🎉 Bonus de bienvenue</p>
                            <p style={{ fontSize:12, color:"rgba(232,234,240,0.6)", lineHeight:1.6 }}>{plan.details.bienvenue}</p>
                          </div>
                        )}
                        {/* Referral button */}
                        <a href={REFERRALS.revolut.url} target="_blank" rel="noopener noreferrer" style={{
                          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                          marginTop:14, padding:"12px 16px", borderRadius:12, textDecoration:"none",
                          background:`linear-gradient(135deg, ${plan.color}33, ${plan.color}11)`,
                          border:`1px solid ${plan.color}55`,
                        }}>
                          <span style={{ fontSize:14 }}>🔗</span>
                          <div style={{ textAlign:"center" }}>
                            <p style={{ fontSize:12, fontWeight:700, color:plan.color }}>{REFERRALS.revolut.label}</p>
                            <p style={{ fontSize:10, color:"rgba(232,234,240,0.5)", marginTop:1 }}>✨ {REFERRALS.revolut.bonus}</p>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </>}

              {/* Amex plans */}
              {cardsBrand==="amex" && <>
                <p style={{ fontSize:11, color:"rgba(232,234,240,0.4)" }}>3 cartes disponibles · débit différé · 1ère année gratuite sur Gold</p>
                {AMEX_PLANS.map((plan, i) => (
                  <div key={i} style={{
                    background: openCard===i ? "#252837" : "transparent",
                    border:`1px solid ${openCard===i ? plan.color+"55" : plan.hot ? plan.color+"33" : "rgba(255,255,255,0.08)"}`,
                    borderRadius:16, overflow:"hidden", transition:"all .15s",
                  }}>
                    <div onClick={() => setOpenCard(openCard===i ? null : i)} style={{ padding:"14px 16px", cursor:"pointer" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:36, height:36, borderRadius:10, background:`${plan.color}22`, border:`1.5px solid ${plan.color}44`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <span style={{ fontSize:11, fontWeight:800, color:plan.color }}>A</span>
                          </div>
                          <div>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <p style={{ fontSize:14, color:"#E8EAF0", fontWeight:600 }}>Amex {plan.name}</p>
                              {plan.hot && <span style={{ fontSize:9, color:"#3EC98A", background:"#3EC98A22", padding:"2px 7px", borderRadius:999, fontWeight:700 }}>⭐ RECOMMANDÉ</span>}
                            </div>
                            <p style={{ fontSize:11, color:plan.color, marginTop:2 }}>{plan.badge} · {plan.ideal}</p>
                          </div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <p style={{ fontSize:16, fontWeight:800, fontFamily:"'Syne',sans-serif", color:plan.color }}>{plan.price}€</p>
                          <p style={{ fontSize:9, color:"rgba(232,234,240,0.4)" }}>/mois</p>
                        </div>
                      </div>
                    </div>
                    {openCard===i && (
                      <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", padding:"12px 16px 16px" }}>
                        <div style={{ background:`${plan.color}11`, borderRadius:10, padding:"8px 12px", marginBottom:10 }}>
                          <p style={{ fontSize:11, color:plan.color, fontWeight:600 }}>Accumulation : {plan.points}</p>
                        </div>
                        <p style={{ fontSize:11, color:"rgba(232,234,240,0.6)", fontWeight:600, marginBottom:6 }}>✅ Avantages</p>
                        {plan.avantages.map((a,j) => (
                          <div key={j} style={{ display:"flex", gap:8, marginBottom:5 }}>
                            <span style={{ color:"#3EC98A", flexShrink:0 }}>•</span>
                            <p style={{ fontSize:12, color:"rgba(232,234,240,0.6)", lineHeight:1.5 }}>{a}</p>
                          </div>
                        ))}
                        <p style={{ fontSize:11, color:"rgba(232,234,240,0.6)", fontWeight:600, marginTop:10, marginBottom:6 }}>⚠️ Limites</p>
                        {plan.limites.map((l,j) => (
                          <div key={j} style={{ display:"flex", gap:8, marginBottom:5 }}>
                            <span style={{ color:"#F06070", flexShrink:0 }}>•</span>
                            <p style={{ fontSize:12, color:"rgba(232,234,240,0.5)", lineHeight:1.5 }}>{l}</p>
                          </div>
                        ))}
                        <div style={{ background:"rgba(232,234,240,0.05)", borderRadius:10, padding:"10px 12px", marginTop:10, borderLeft:`3px solid ${plan.color}` }}>
                          <p style={{ fontSize:12, color:"rgba(232,234,240,0.7)", lineHeight:1.6, fontStyle:"italic" }}>💬 {plan.who}</p>
                        </div>
                        {/* Détails enrichis */}
                        {plan.details?.assurance && (
                          <div style={{ marginTop:10 }}>
                            <p style={{ fontSize:11, color:"rgba(232,234,240,0.6)", fontWeight:600, marginBottom:5 }}>🛡️ Assurance incluse</p>
                            <p style={{ fontSize:12, color:"rgba(232,234,240,0.5)", lineHeight:1.6 }}>{plan.details.assurance}</p>
                          </div>
                        )}
                        {plan.details?.abonnements && (
                          <div style={{ marginTop:10 }}>
                            <p style={{ fontSize:11, color:"rgba(232,234,240,0.6)", fontWeight:600, marginBottom:5 }}>🎁 Abonnements & crédits inclus</p>
                            <p style={{ fontSize:12, color:"rgba(232,234,240,0.5)", lineHeight:1.6 }}>{plan.details.abonnements}</p>
                          </div>
                        )}
                        {plan.details?.bienvenue && (
                          <div style={{ marginTop:10, background:"rgba(62,201,138,0.08)", border:"1px solid rgba(62,201,138,0.25)", borderRadius:10, padding:"10px 12px" }}>
                            <p style={{ fontSize:11, color:"#3EC98A", fontWeight:600, marginBottom:4 }}>🎉 Bonus de bienvenue</p>
                            <p style={{ fontSize:12, color:"rgba(232,234,240,0.6)", lineHeight:1.6 }}>{plan.details.bienvenue}</p>
                          </div>
                        )}
                        <a href={REFERRALS.amex.url} target="_blank" rel="noopener noreferrer" style={{
                          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                          marginTop:14, padding:"12px 16px", borderRadius:12, textDecoration:"none",
                          background:`linear-gradient(135deg, ${plan.color}33, ${plan.color}11)`,
                          border:`1px solid ${plan.color}55`,
                        }}>
                          <span style={{ fontSize:14 }}>🔗</span>
                          <div style={{ textAlign:"center" }}>
                            <p style={{ fontSize:12, fontWeight:700, color:plan.color }}>{REFERRALS.amex.label}</p>
                            <p style={{ fontSize:10, color:"rgba(232,234,240,0.5)", marginTop:1 }}>✨ {REFERRALS.amex.bonus}</p>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ background:"rgba(212,168,67,0.08)", border:"1px solid rgba(212,168,67,0.25)", borderRadius:14, padding:"12px 16px" }}>
                  <p style={{ fontSize:11, color:"#D4A843", fontWeight:600, marginBottom:5 }}>⚠️ À savoir sur l'acceptation Amex</p>
                  <p style={{ fontSize:12, color:"rgba(232,234,240,0.5)", lineHeight:1.6 }}>Environ 70% des commerces physiques en France acceptent Amex. Toujours avoir une carte Visa/Mastercard (Revolut) en backup, notamment dans les petits commerces et certains restaurants.</p>
                </div>
              </>}
            </>}

            {/* ══ GUIDE ══ */}
            {tab==="guide" && <>
              <div>
                <p style={{ fontSize:16, fontWeight:700, color:"#E8EAF0", marginBottom:4 }}>📚 Guide & Astuces</p>
                <p style={{ fontSize:12, color:"rgba(232,234,240,0.4)" }}>Tout ce qu'il faut savoir pour maximiser tes miles.</p>
              </div>

              {/* Section tabs */}
              <div style={{ display:"flex", gap:8 }}>
                {[{id:"faq",label:"❓ FAQ"},{id:"guides",label:"📋 Guides"},{id:"tips",label:"💡 Astuces"}].map(s2 => (
                  <button key={s2.id} onClick={() => setGuideSection(s2.id)} style={{
                    flex:1, padding:"8px 0", borderRadius:12, cursor:"pointer",
                    fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight: guideSection===s2.id ? 600 : 400,
                    background: guideSection===s2.id ? "#5B7FFF" : "rgba(232,234,240,0.10)",
                    color: guideSection===s2.id ? "#fff" : "rgba(232,234,240,0.4)",
                    border: guideSection===s2.id ? "none" : "1px solid rgba(255,255,255,0.08)",
                    transition:"all .15s",
                  }}>{s2.label}</button>
                ))}
              </div>

              {/* FAQ */}
              {guideSection==="faq" && <>
                <p style={{ fontSize:11, color:"rgba(232,234,240,0.4)" }}>{FAQ_DATA.length} questions fréquentes</p>
                {FAQ_DATA.map((item,i) => (
                  <div key={i} onClick={() => setOpenFaq(openFaq===i ? null : i)} style={{
                    background: openFaq===i ? "#252837" : "transparent",
                    border:`1px solid ${openFaq===i ? "#5B7FFF44" : "rgba(255,255,255,0.08)"}`,
                    borderRadius:14, padding:"13px 16px", cursor:"pointer", transition:"all .15s",
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
                      <p style={{ fontSize:13, color:"#E8EAF0", fontWeight:500, lineHeight:1.4 }}>{item.q}</p>
                      <span style={{ fontSize:12, color:"rgba(232,234,240,0.4)", flexShrink:0 }}>{openFaq===i?"▲":"▼"}</span>
                    </div>
                    {openFaq===i && (
                      <p style={{ fontSize:12, color:"rgba(232,234,240,0.4)", marginTop:10, lineHeight:1.7, borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:10 }}>
                        {item.a}
                      </p>
                    )}
                  </div>
                ))}
              </>}

              {/* GUIDES */}
              {guideSection==="guides" && <>
                <p style={{ fontSize:11, color:"rgba(232,234,240,0.4)" }}>{GUIDES_DATA.length} guides pas à pas</p>
                {GUIDES_DATA.map((g,i) => (
                  <div key={i} style={{
                    background: openGuide===i ? "#252837" : "transparent",
                    border:`1px solid ${openGuide===i ? g.color+"44" : "rgba(255,255,255,0.08)"}`,
                    borderRadius:16, overflow:"hidden", transition:"all .15s",
                  }}>
                    <div onClick={() => setOpenGuide(openGuide===i ? null : i)} style={{ padding:"14px 16px", cursor:"pointer" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{ fontSize:22 }}>{g.icon}</span>
                          <div>
                            <p style={{ fontSize:13, color:"#E8EAF0", fontWeight:500 }}>{g.title}</p>
                            <p style={{ fontSize:10, color:"rgba(232,234,240,0.4)", marginTop:2 }}>⏱ {g.duration}</p>
                          </div>
                        </div>
                        <span style={{ fontSize:10, color:g.color, background:`${g.color}22`, padding:"3px 10px", borderRadius:999, flexShrink:0 }}>
                          {openGuide===i ? "Fermer" : "Voir →"}
                        </span>
                      </div>
                    </div>
                    {openGuide===i && (
                      <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", padding:"12px 16px 16px" }}>
                        {g.steps.map((step,j) => (
                          <div key={j} style={{ display:"flex", gap:12, marginBottom:j<g.steps.length-1?10:0 }}>
                            <div style={{
                              width:22, height:22, borderRadius:"50%", flexShrink:0,
                              background: step.startsWith("⚠️")||step.startsWith("💡") ? "transparent" : `${g.color}22`,
                              border: step.startsWith("⚠️")||step.startsWith("💡") ? "none" : `1px solid ${g.color}44`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              fontSize: step.startsWith("⚠️")||step.startsWith("💡") ? 14 : 10,
                              color:g.color, fontWeight:700, marginTop:1,
                            }}>
                              {step.startsWith("⚠️") ? "⚠️" : step.startsWith("💡") ? "💡" : j+1}
                            </div>
                            <p style={{ fontSize:12, color: step.startsWith("⚠️")||step.startsWith("💡") ? "#D4A843" : "rgba(232,234,240,0.7)", lineHeight:1.6, paddingTop:2 }}>
                              {step.startsWith("⚠️")||step.startsWith("💡") ? step.slice(2).trim() : step}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>}

              {/* TIPS */}
              {guideSection==="tips" && <>
                <p style={{ fontSize:11, color:"rgba(232,234,240,0.4)" }}>{TIPS_DATA.length} astuces & bons plans</p>
                {TIPS_DATA.map((tip,i) => (
                  <div key={i} style={{
                    background:"#252837",
                    border:`1px solid ${tip.color}33`,
                    borderLeft:`3px solid ${tip.color}`,
                    borderRadius:14, padding:"14px 16px",
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ fontSize:18 }}>{tip.icon}</span>
                        <span style={{ fontSize:10, color:tip.color, background:`${tip.color}18`, padding:"2px 8px", borderRadius:999, fontWeight:600 }}>{tip.tag}</span>
                      </div>
                    </div>
                    <p style={{ fontSize:13, color:"#E8EAF0", fontWeight:500, marginBottom:8 }}>{tip.title}</p>
                    <p style={{ fontSize:12, color:"rgba(232,234,240,0.5)", lineHeight:1.7 }}>{tip.body}</p>
                  </div>
                ))}
              </>}
            </>}

          </div>

          {/* Nav */}
          <div style={{
            position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
            width:"100%", maxWidth:430,
            background:`${C.bg}EE`, backdropFilter:"blur(12px)",
            borderTop:`1px solid ${C.border}`,
            display:"flex", justifyContent:"space-around", padding:"10px 0 14px",
            zIndex:100,
          }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background:"transparent", border:"none", cursor:"pointer",
                fontSize:22, opacity:tab===t.id?1:0.35,
                transform:tab===t.id?"scale(1.15)":"scale(1)",
                transition:"all .15s",
              }}>{t.label}</button>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
