import React, { useEffect, useState } from "react";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import { GetStaticProps } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import { useRouter } from "next/router";

interface Props {
  posts: [Post];
}

function Category({ posts }: Props) {
  const router = useRouter();
  const params = router.query.slug;

  return (
    <main className="max-w-7xl mx-auto">
      <Header />
      <div className="py-2 border-y border-b-gray-200">
        <h1 className="text-5xl xl:text-7xl uppercase font-semibold text-center">
          {params}
        </h1>
      </div>

      <div className=" grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {posts.map(
          (post) =>
            post.categories.slug.current === params && (
              <Link key={post._id} href={`/post/${post.slug.current}`}>
                <div className="border rounded-lg group cursor-pointer shadow-xl">
                  <img
                    className="h-60 w-full object-contain group-hover:scale-105 transition-transform duration-200 ease-in-out"
                    src={urlFor(post.mainImage).url()!}
                    alt="img"
                  />
                  <div className=" flex justify-between p-5 bg-white ">
                    <div>
                      <p>{post.title}</p>
                      <p>
                        {post.description} by {post.author.name}
                      </p>
                      <p>{post.categories.slug.current}</p>
                    </div>
                    <img
                      className="h-12 w-12 rounded-full"
                      src={urlFor(post.author.image).url()!}
                      alt="img"
                    />
                  </div>
                </div>
              </Link>
            )
        )}
      </div>
    </main>
  );
}

export default Category;

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
      _id,
      title,
      author->{
        name,
        image
      },
        description,
        mainImage,
        slug,
        categories[0]->{
          _id,
          slug 
        },  
    }`;
  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
