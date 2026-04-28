// ============================================
// FIREWORKS ANIMATION
// ============================================
class Particle {
    constructor(x, y, vx, vy, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = Math.random() * 3 + 2;
        this.gravity = 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life--;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Fireworks {
    constructor() {
        this.canvas = document.getElementById('fireworks-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    burst(x, y) {
        const colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4ecdc4', '#ff6348', '#a29bfe', '#fd79a8'];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 4 + Math.random() * 4;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const life = 40 + Math.random() * 20;

            this.particles.push(new Particle(x, y, vx, vy, color, life));
        }
    }

    update() {
        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => p.update());
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => p.draw(this.ctx));
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

const fireworks = new Fireworks();

// ============================================
// LIKE BUTTON FIREWORKS
// ============================================
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.innerText.includes('Like')) {
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Trigger fireworks at button position
            fireworks.burst(centerX, centerY);

            // Toggle like state
            this.classList.toggle('liked');
            if (this.classList.contains('liked')) {
                this.innerHTML = '<i class="fas fa-heart"></i> Liked';
                this.style.color = '#ef4444';
            } else {
                this.innerHTML = '<i class="far fa-heart"></i> Like';
                this.style.color = '#6b7280';
            }
        }
    });
});

// ============================================
// OTHER BUTTON HANDLERS
// ============================================
document.querySelector('.btn-compose').addEventListener('click', function() {
    alert('Compose post feature coming soon!');
});

document.querySelector('.btn-post').addEventListener('click', function() {
    const textarea = document.querySelector('.post-input');
    if (textarea.value.trim()) {
        textarea.value = '';
    }
});

document.querySelectorAll('.btn-follow').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        this.innerText = this.innerText === 'Follow' ? 'Following' : 'Follow';
        this.style.opacity = this.innerText === 'Following' ? '0.7' : '1';
    });
});

document.querySelectorAll('.post').forEach(post => {
    post.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    post.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

document.querySelector('.search-bar input').addEventListener('input', function(e) {
    console.log('Searching for:', e.target.value);
});

console.log('🚀 SocialHub loaded with fireworks! 🎆');
