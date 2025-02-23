// Activer GSAP + ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialiser la map Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic2lnYXRuZ3V5ZW4iLCJhIjoiY203MzYxdzdzMGZ1ajJpc2ZwZmRzczIwZCJ9.Jpxbl-gh-nuwDodqWlmWEA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/sigatnguyen/cm7gqo8ml00jr01s86xieg74u',
  center: [137, 20],
  zoom: 4,
  pitch: 0,
  bearing: 0
});
map.addControl(new mapboxgl.NavigationControl());

// Scrollama init
var scroller = scrollama();

// Référence pour le graphique Chart.js
var analysisChart;

/* Création du graphique Chart.js */
function createAnalysisChart() {
  var ctx = document.getElementById('myChart').getContext('2d');

  var dataNavales = [
    { x: 0, y: 20 },
    { x: 1, y: 45 },
    { x: 2, y: 60 },
    { x: 3, y: 50 },
    { x: 4, y: 70 }
  ];
  var dataAeriennes = [
    { x: 0, y: 10 },
    { x: 1, y: 30 },
    { x: 2, y: 40 },
    { x: 3, y: 35 },
    { x: 4, y: 60 }
  ];

  var config = {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Opérations navales',
          data: dataNavales,
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33,150,243,0.2)',
          borderWidth: 1,
          radius: 0,
          fill: true
        },
        {
          label: 'Opérations aériennes',
          data: dataAeriennes,
          borderColor: '#d32f2f',
          backgroundColor: 'rgba(211,47,47,0.2)',
          borderWidth: 1,
          radius: 0,
          fill: true
        }
      ]
    },
    options: {
      animation: {
        duration: 2000,
        easing: 'linear'
      },
      interaction: {
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#fff',
            font: { size: 16 }
          }
        },
        title: {
          display: true,
          text: "Impact stratégique",
          color: "#fff"
        }
      },
      scales: {
        x: {
          type: 'linear',
          ticks: { color: '#fff' }
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#fff' }
        }
      }
    }
  };

  analysisChart = new Chart(ctx, config);
}

/**
 * handleStepEnter : déclenché à l’entrée d’une section
 */
function handleStepEnter(response) {
  const el = response.element;
  const id = el.id;

  // Rendre visible la section principale
  gsap.to(el, { opacity: 1, duration: 0.5 });
  el.style.pointerEvents = 'auto';

  // Logiques spécifiques selon la section
  if (id === "intro") {
    // Pour l'intro : overlay visible, carte masquée
    document.getElementById("blue-overlay").classList.remove("hide-overlay");
    gsap.to("#map", { opacity: 0, duration: 0.5 });
  }
  else if (id === "pearl-harbor" || id === "midway" || id === "hiroshima-nagasaki") {
    // Pour ces chapitres : afficher la carte et masquer l'overlay
    gsap.to("#map", { opacity: 1, duration: 0.5 });
    document.getElementById("blue-overlay").classList.add("hide-overlay");

    // Afficher le bloc de texte du chapitre
    gsap.to("#" + id + " .text-container", { opacity: 1, duration: 0.5 });

    // FlyTo selon la section
    if (id === "pearl-harbor") {
      map.flyTo({ center: [-157.95, 21.35], zoom: 10, duration: 2000 });
    } else if (id === "midway") {
      map.flyTo({ center: [-177.4, 28.2], zoom: 12, duration: 2000 });
    } else if (id === "hiroshima-nagasaki") {
      map.flyTo({ center: [132.5, 34.4], zoom: 10, duration: 2000 });
    }
  }
  else if (id === "analysis") {
    // Section d'analyse : masquer la carte et afficher l'analyse en plein écran
    gsap.to("#map", { opacity: 0, duration: 0.5 });
    gsap.to("#analysis .analysis-fullscreen", {
      opacity: 1,
      duration: 0.5,
      onComplete: function() {
        if (!analysisChart) {
          createAnalysisChart();
        }
      }
    });
  }
  else if (id === "conclusion") {
    // Conclusion : overlay visible, carte masquée
    document.getElementById("blue-overlay").classList.remove("hide-overlay");
    gsap.to("#map", { opacity: 0, duration: 0.5 });
  }
}

/**
 * handleStepExit : déclenché quand on quitte une section
 */
function handleStepExit(response) {
  const el = response.element;
  const id = el.id;

  // Remettre la section en opacité 0 (fade out)
  gsap.to(el, { opacity: 0, duration: 0.5 });
  el.style.pointerEvents = 'none';

  // Pour la section analysis, masquer aussi le bloc d'analyse
  if (id === "analysis") {
    gsap.to("#analysis .analysis-fullscreen", { opacity: 0, duration: 0.5 });
  }
}

// Configuration de Scrollama
scroller.setup({
  step: ".step",
  offset: 0.3,   // Ajustez si besoin
  debug: false
})
.onStepEnter(handleStepEnter)
.onStepExit(handleStepExit);

// Recalculer au redimensionnement
window.addEventListener("resize", scroller.resize);

/* Barre de progression */
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset || document.documentElement.scrollTop;
  const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrolled / maxHeight) * 100;
  document.getElementById('progress-bar').style.width = progress + '%';
});
