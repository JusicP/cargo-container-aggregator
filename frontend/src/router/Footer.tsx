import {BrandFacebook, BrandGithub, BrandGoogle, BrandTwitter} from "@mynaui/icons-react";

export default function Footer() {
    return (
        <footer className="footer bg-[#595F65] text-white">
            <div className="footer-content flex justify-between">
                <div className="footer-brand">
                    <h2>Cargo Containers</h2>
                    <p>Купівля та оренда контейнерів онлайн</p>
                </div>
                <div className="flex flex-col items-center">
                    <nav className="footer-nav flex flex-row gap-10">
                        <a href="#">Про нас</a>
                        <a href="#">Контакти</a>
                        <a href="#">Оголошення</a>
                    </nav>
                    <div className="footer-social flex flex-row gap-5">
                        <BrandGithub />
                        <BrandGoogle />
                        <BrandFacebook />
                        <BrandTwitter />
                        <a href="mailto:contact@cargocontainers.com">contact@cargocontainers.com</a>
                    </div>
                </div>
            </div>
            <br className="text-white" />
            <div className="footer-bottom">
                <p>© 2023 Cargo Containers. Усі права захищені.</p>
            </div>
        </footer>
    )
}