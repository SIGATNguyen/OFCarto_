// Enregistrement du plugin ScrollTrigger de GSAP
gsap.registerPlugin(ScrollTrigger);

// Initialisation de Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic2lnYXRuZ3V5ZW4iLCJhIjoiY203MzYxdzdzMGZ1ajJpc2ZwZmRzczIwZCJ9.Jpxbl-gh-nuwDodqWlmWEA'; // Remplacez par votre token Mapbox
var map = new mapboxgl.Map({
  container: 'map',
  // Style sombre/terreux personnalisé
  style: 'mapbox://styles/sigatnguyen/cm7gqo8ml00jr01s86xieg74u',
  center: [137, 20],
  zoom: 4,
  pitch: 0,
  bearing: 0
});
map.addControl(new mapboxgl.NavigationControl());

// Initialisation de Scrollama
var scroller = scrollama();

/* 1) Création du graphique Chart.js */
var analysisChart;
function createAnalysisChart() {
  var ctx = document.getElementById('myChart').getContext('2d');

  // Données pour l'axe x (0 à 4 correspond à Mai-Septembre)
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
          borderColor: '#2196F3',          // Bleu
          backgroundColor: 'rgba(33,150,243,0.2)',
          borderWidth: 1,
          radius: 0,
          fill: true
        },
        {
          label: 'Opérations aériennes',
          data: dataAeriennes,
          borderColor: '#d32f2f',          // Rouge
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
          text: "Impact stratégique"
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

/* 2) handleStepEnter */
function handleStepEnter(response) {
  var id = response.element.id;
  console.log("Entrée dans :", id);

  if (id === "intro") {
    document.getElementById("intro").style.display = "flex";
    gsap.to("#intro .intro-article", { opacity: 1, duration: 0.5 });
    document.getElementById("blue-overlay").classList.remove("hide-overlay");
    gsap.to("#map", { opacity: 0, duration: 0.5 });
  }
  else if (id === "pearl-harbor" || id === "midway" || id === "hiroshima-nagasaki") {
    gsap.to("#map", { opacity: 1, duration: 0.5 });
    document.getElementById("blue-overlay").classList.add("hide-overlay");
    gsap.to("#" + id + " .text-container", { opacity: 1, duration: 0.5 });
    if (id === "pearl-harbor") {
      map.flyTo({ center: [-157.95, 21.35], zoom: 10, duration: 2000 });
    } else if (id === "midway") {
      map.flyTo({ center: [-177.4, 28.2], zoom: 12, duration: 2000 });
    } else if (id === "hiroshima-nagasaki") {
      map.flyTo({ center: [132.5, 34.4], zoom: 10, duration: 2000 });
    }
  }
  else if (id === "analysis") {
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
    document.getElementById("blue-overlay").classList.remove("hide-overlay");
    gsap.to("#map", { opacity: 0, duration: 0.5 });
    gsap.to("#conclusion .final-article", { opacity: 1, duration: 0.5 });
  }
}

/* 3) handleStepExit */
function handleStepExit(response) {
  var id = response.element.id;
  console.log("Sortie de :", id);

  if (id === "intro" && response.direction === "down") {
    gsap.to("#intro .intro-article", {
      opacity: 0,
      duration: 0.5,
      onComplete: function() {
        document.getElementById("intro").style.display = "none";
      }
    });
    document.getElementById("blue-overlay").classList.add("hide-overlay");
    gsap.to("#map", { opacity: 1, duration: 0.5 });
  }
  if (id === "analysis" && response.direction === "down") {
    gsap.to("#analysis .analysis-fullscreen", { opacity: 0, duration: 0.5 });
    gsap.to("#map", { opacity: 1, duration: 0.5 });
  }
  if (id === "conclusion" && response.direction === "up") {
    document.getElementById("blue-overlay").classList.add("hide-overlay");
    gsap.to("#map", { opacity: 1, duration: 0.5 });
  }
}

/* 4) Scrollama setup */
scroller.setup({
  step: ".step",
  offset: 0.3,
  debug: false
})
.onStepEnter(handleStepEnter)
.onStepExit(handleStepExit);

window.addEventListener("resize", scroller.resize);

/* 5) Barre de progression */
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset || document.documentElement.scrollTop;
  const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrolled / maxHeight) * 100;
  document.getElementById('progress-bar').style.width = progress + '%';
});