/* ==========================================================================
   ASOCIACIÓN CIVIL AMIGOS DE LOS ANIMALES - DONACIONES & CÁLCULO DE IMPACTO
   ========================================================================== */

const DONATION_INFO = {
    alias: "alias.ejemplo",
    cbu: "0000003100098765432100",
    titular: "Asociación Civil Amigos de los Animales No Humanos",
    mpLink: "https://www.mercadopago.com.ar"
};

document.addEventListener('DOMContentLoaded', () => {
    initDonationCalculator();
});

function copyAlias() {
    copyToClipboard(DONATION_INFO.alias, 'Alias bancario');
}

function copyCBU() {
    copyToClipboard(DONATION_INFO.cbu, 'CBU bancario');
}

function donateMercadoPago(amount) {
    showToast(`Redirigiendo a Mercado Pago por $${amount.toLocaleString('es-AR')}...`, 'info');
    setTimeout(() => {
        window.open(DONATION_INFO.mpLink, '_blank');
    }, 800);
}

function selectQuickDonation(amount) {
    const amountInput = document.getElementById('custom-donation-amount');
    const impactText = document.getElementById('donation-impact-text');
    if (amountInput) {
        amountInput.value = amount;
    }
    if (impactText) {
        impactText.innerText = buildImpactMessage(amount);
    }
    donateMercadoPago(amount);
}

/* Precios de referencia actualizados en Argentina (2026).
   Reflejan costos reales de insumos veterinarios y alimento para la asociación. */
const IMPACT_PRICES = {
    alimentoKg: 2500,        // $2.500 por kg de alimento balanceado estándar
    desparasitante: 5000,    // $5.000 comprimido antiparasitario interno
    pipeta: 9000,            // $9.000 pipeta antipulgas y garrapatas
    vacuna: 20000,           // $20.000 vacuna séxtuple / antirrábica
    bolsaAlimento: 35000,    // $35.000 bolsa de alimento de 15 kg
    castracion: 40000        // $40.000 castración y protocolo quirúrgico
};

function formatPesos(n) {
    return '$' + Math.round(n).toLocaleString('es-AR');
}

function buildImpactMessage(val) {
    const p = IMPACT_PRICES;
    if (val <= 0) return '🌱 ¡Ingresá un monto para ver a qué equivale!';
    if (val < p.desparasitante) {
        const kg = (val / p.alimentoKg).toFixed(1).replace('.', ',');
        return `🌱 ¡Todo suma! Con ${formatPesos(val)} cubrís cerca de ${kg} kg de alimento balanceado para un rescatado.`;
    }
    if (val < p.pipeta) {
        const desparasitantes = Math.floor(val / p.desparasitante);
        const kg = Math.floor(val / p.alimentoKg);
        return `💊 Con ${formatPesos(val)} cubrís ${desparasitantes} desparasitante${desparasitantes > 1 ? 's' : ''} interno o unos ${kg} kg de alimento balanceado.`;
    }
    if (val < p.vacuna) {
        const pipetas = Math.floor(val / p.pipeta);
        const kg = Math.floor(val / p.alimentoKg);
        return `🐾 Con ${formatPesos(val)} cubrís ${pipetas} pipeta${pipetas > 1 ? 's' : ''} antipulgas/garrapatas o unos ${kg} kg de alimento.`;
    }
    if (val < p.bolsaAlimento) {
        const vacunas = Math.floor(val / p.vacuna);
        const pipetas = Math.floor(val / p.pipeta);
        return `💉 Con ${formatPesos(val)} financiás ${vacunas} dosis de vacuna completa anual o ${pipetas} pipetas antipulgas.`;
    }
    if (val < p.castracion) {
        const bolsas = Math.floor(val / p.bolsaAlimento);
        const vacunas = Math.floor(val / p.vacuna);
        return `📦 ¡Excelente aporte! Con ${formatPesos(val)} cubrís 1 bolsa de alimento de 15 kg o ${vacunas} vacunas completas.`;
    }
    const castraciones = Math.floor(val / p.castracion);
    const bolsas = Math.floor(val / p.bolsaAlimento);
    return `❤️ ¡Impacto enorme! Con ${formatPesos(val)} cubrís ${castraciones} castración${castraciones > 1 ? 'es' : ''} o ${bolsas} bolsa${bolsas > 1 ? 's' : ''} de alimento de 15 kg más curaciones.`;
}

function initDonationCalculator() {
    const amountInput = document.getElementById('custom-donation-amount');
    const impactText = document.getElementById('donation-impact-text');

    if (!amountInput || !impactText) return;

    amountInput.addEventListener('input', () => {
        const val = parseInt(amountInput.value) || 0;
        impactText.innerText = buildImpactMessage(val);
    });
}
