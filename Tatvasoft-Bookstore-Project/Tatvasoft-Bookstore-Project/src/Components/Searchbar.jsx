import { Button, List, ListItem, TextField } from "@mui/material";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import bookService from "../service/book.service";
import shared from "../utils/shared";

import { useDispatch, useSelector } from "react-redux";
import { fetchCartData } from "../State/Slice/cartSlice";

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const [bookList, setBookList] = useState([]);
  const [openSearchResult, setOpenSearchResult] = useState(false);
  const searchBook = async () => {
    const res = await bookService.searchBook(query);
    setBookList(res);
  };
  const search = () => {
    searchBook();
    setOpenSearchResult(true);
  };
  const navigate = useNavigate();

  const authData = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const addToCart = (book) => {
    if (!authData.id) {
      navigate("/login");
      toast.error("Please login before adding books to cart");
    } else {
      shared
        .addToCart(book, authData.id)
        .then((res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            toast.success("Item added in cart");
            // cartContext.updateCart();
            dispatch(fetchCartData(authData.id));
          }
        })
        .catch((err) => {
          toast.warning(err);
        });
    }
  };
  return (
    <div className="flex bg-[#efefef] h-20 items-center justify-center space-x-3 " style={{margin:"0px!important"}}>
      <div style={{width:"80%",display:"inline-block",position:"relative",top:"-30px",marginLeft:"10%"}}>
        <TextField
          hiddenLabel
          label="What are you Looking for..."
          type={"text"}
          value={query}
          variant="outlined"
          size="small"
          sx={{
            width: "550px",
            backgroundColor: "white",
            fontStyle: "italic",
            "& .MuiInputBase-input": {
              fontStyle: "normal",
            },
          }}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />

        
      <div style={{width:"20%",display:"inline-block"}}>
      <Button
        variant="contained"
        startIcon={<AiOutlineSearch />}
        sx={{
          color: "white",
          backgroundColor: "#80BF32",
          "&:hover": {
            backgroundColor: "#80BF32", // Change the hover background color
          },
          textTransform: "capitalize",
          margin:"5px"
        }}
        onClick={search}
        >
        Search
      </Button>
      <Button
        variant="contained"
        sx={{
          color: "white",
          backgroundColor: "#f14d54",
          "&:hover": {
            backgroundColor: "#f14d54", // Change the hover background color
          },
          textTransform: "capitalize",
        }}
        onClick={() => {
          setOpenSearchResult(false);
          setQuery("");
        }}
        >
        Cancel
      </Button>
      </div>
      {openSearchResult && (
          <div
            className="bg-white w-[550px] shadow-lg absolute"
            style={{
              background: "white",
              zIndex: "9",
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
              width:"56%"
            }}
          >
            {bookList?.length === 0 && <p>No Product Found</p>}
            <List>
              {bookList?.length > 0 &&
                bookList.map((item, index) => (
                  <ListItem className="flex-1 " key={index} style={{borderBottom:"1px solid black",marginLeft:"13px",padding:"0"}}>
                    <div className="flex  w-full" >
                      <div className="flex-1 ">
                        <p className="font-semibold" style={{padding:"0px",margin:"0px",fontWeight:"bold"}}>{item.name}</p>
                        <p className=" line-clamp-1" style={{padding:"0px",margin:"0px"}}>{item.description}</p>
                      </div>
                      <div className=" text-right ml-4">
                        <p style={{padding:"0px",marginTop:"10px"}}>{item.price}</p>
                        <Button
                          sx={{
                            color: "#f14d54",
                            textTransform: "capitalize",
                            margin:"0px"
                          }}
                          onClick={() => addToCart(item)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </ListItem>
                ))}
            </List>
          </div>
        )}
        </div>
    </div>
  );
}
