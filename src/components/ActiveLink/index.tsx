import Link, { LinkProps } from "next/link";
import { cloneElement, ReactElement } from "react";
import { useRouter } from "next/router";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({
  children,
  activeClassName,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter();
  // O ASPATH IRÁ ME RETORNAR O PATH NA QUAL A APLICAÇÃO ESTÁ, OU SEJA, '/' PARA HOME, OU '/POSTS' PARA POSTS

  const className = asPath === rest.href ? activeClassName : "";
  return <Link {...rest}>{cloneElement(children, { className })}</Link>;
}

// cloneElement do react é uma funcionalidade avançada do react. O primeiro argumento é o elemento,
// que será clonado. No segundo argumento, será um objeto com as propriedades que será passadas
// à esse elemento.
// Nesse caso, clonei o elemento que é o CHILDREN, e passei a propriedade CLASSNAME modificada.
// Pois nesse caso, não é possível passar um <children> como elemento react e adicionar as propri-
// edades da forma padrão.
