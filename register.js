const form = document.forms[0];
const steps = form.querySelectorAll(':scope > fieldset');
const bars = document.querySelectorAll('.progress li');

const current = () => Math.min(Number(location.hash.slice(1)) || 1, steps.length) - 1;

const show = () => {
    const step = current();
    steps.forEach((fieldset, index) => fieldset.disabled = index !== step);
    bars.forEach((bar, index) => bar.classList.toggle('done', index <= step));
};

onhashchange = show;
show();

form.onsubmit = event => {
    event.preventDefault();
    if (current() < steps.length - 1) {
        location.hash = current() + 2;
        return;
    }
    const email = sessionStorage.getItem('email');
    if (email) localStorage.setItem(email, form.account.value);
    location.href = 'welcome?' + form.account.value;
};

form.querySelectorAll('[type="checkbox"][required]').forEach(box => {
    const group = form.querySelectorAll(`[name="${box.name}"]`);
    box.onchange = () => group.forEach(item => item.required = ![...group].some(other => other.checked));
});

form.querySelectorAll('textarea').forEach(area => {
    area.oninput = () => {
        area.nextElementSibling.textContent = `${area.value.length}/${area.maxLength} characters`;
    };
});

form.querySelectorAll('.add').forEach(input => {
    const add = () => {
        const name = input.value.trim();
        input.value = '';
        if (!name) return;
        const chip = input.previousElementSibling.cloneNode(true);
        chip.querySelector('span').textContent = name;
        chip.querySelector('input').checked = true;
        input.before(chip);
    };

    input.onblur = add;
    input.onkeydown = event => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        add();
    };
});
